// src/services/salesforce.js
import jsforce from 'jsforce';

class SalesforceService {
  constructor() {
    this.conn = null;
  }

  async connect() {
    if (this.conn) return this.conn;

    this.conn = new jsforce.Connection({
      loginUrl: process.env.SF_INSTANCE_URL
    });

    try {
      await this.conn.login(
        process.env.SF_USERNAME,
        process.env.SF_PASSWORD + process.env.SF_SECURITY_TOKEN
      );
      console.log('Connected to Salesforce successfully');
      return this.conn;
    } catch (error) {
      console.error('Error connecting to Salesforce:', error);
      throw error;
    }
  }

  async createAssessmentRecord(userData, assessmentData) {
    try {
      await this.connect();
      
      // First create Contact record
      const contactResult = await this.conn.sobject('Contact').create({
        FirstName: userData.firstName,
        LastName: userData.lastName,
        Email: userData.email,
      });

      if (!contactResult.success) {
        throw new Error('Failed to create Contact record');
      }

      // Create Assessment record
      const assessmentResult = await this.conn.sobject('Enneagram_Assessment__c').create({
        Contact__c: contactResult.id,
        Assessment_Date__c: new Date().toISOString(),
        Status__c: 'Completed',
        // Add other assessment fields based on your Salesforce object structure
      });

      // Create Assessment Responses records
      const responses = assessmentData.map(response => ({
        Assessment__c: assessmentResult.id,
        Question_Number__c: response.questionNumber,
        Response__c: response.answer,
        Question_Type__c: response.type // 'Likert' or 'Rank-Choice'
      }));

      const responseResults = await this.conn.sobject('Assessment_Response__c')
        .create(responses);

      return {
        contactId: contactResult.id,
        assessmentId: assessmentResult.id,
        responses: responseResults
      };
    } catch (error) {
      console.error('Error creating Salesforce records:', error);
      throw error;
    }
  }

  async getAssessmentHistory(email) {
    try {
      await this.connect();
      
      // Query Contact and related Assessments
      const result = await this.conn.query(`
        SELECT Id, FirstName, LastName,
          (SELECT Id, Assessment_Date__c, Status__c 
           FROM Enneagram_Assessments__r 
           ORDER BY Assessment_Date__c DESC)
        FROM Contact 
        WHERE Email = '${email}'
      `);

      return result.records;
    } catch (error) {
      console.error('Error fetching assessment history:', error);
      throw error;
    }
  }
}

export const salesforceService = new SalesforceService();