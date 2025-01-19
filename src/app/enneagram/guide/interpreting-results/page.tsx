import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { theme, styleUtils } from '@/styles/theme';

export default function InterpretingResultsPage() {
  const sections = [
    {
      title: "Take the test and then evaluate subjectively",
      content: `The test is only a starting point; your highest score isn't *always* your true type. It's very likely to be one of your top scores, so evaluate them subjectively for which one feels like the most accurate description of you. If you resonate with about 80% of the description, it's likely your type. Similarly, don't rule out a given type if there are a few things you don't resonate with – what you're looking for is the overall pattern.`
    },
    {
      title: "You have one dominant type",
      content: `You have one "dominant" Enneagram type, which explains how you're naturally wired. While everyone has all nine types in them to varying degrees, one type is the most accurate description of you. In other words, you can't be a 3/7/8 - you're either a 3, a 7, or an 8.

Please also note that no type is "better" than any other type. They all have their own set of strengths and growth opportunities.`
    },
    {
      title: `Look at the "why," not just the "what"`,
      content: `Your Enneagram personality type ultimately comes down to why you do what you do, not just what you do. This is the most important concept to consider when evaluating your Enneagram type. If you relate to the primary motive driving a certain Enneagram type, it's very likely to be your type. 

If you find yourself resonating with elements of multiple types, consider the reason you're prone to each behavior or trait that you resonate with. If it doesn't align with the underlying motive of the type you're reading about, it's unlikely to be your true type. Different Enneagram types are often prone to the same behaviors, but for vastly different reasons.`
    },
    {
      title: "Consider what you do under stress",
      content: `Unlike most other personality systems, the Enneagram incorporates the concept of self-awareness. Each of the nine Enneagram types is described across a whole spectrum of functioning – from "at its best" to "at its worst." Most people fall into what's called the "average" range of functioning, and this is where personality is most recognizable.

While you may feel a resistance to the description of your personality type at a lower level of self-awareness, consider it with self-honesty and self-compassion and ask yourself, "Do I ever have the impulse to do these things?" or "Have I ever operated this way in the past?" If the real answer to both of these questions is "no," it's not your type.`
    },
    {
      title: "Share with friends & family",
      content: `It can be helpful to share your results with friends and family and ask them what type they think might be your dominant personality type. While no one else can tell you what your Enneagram type is, sometimes others can offer useful observations as to how they experience you.`
    },
    {
      title: "Have patience!",
      content: `It usually takes people some time learning and working with the system to determine their type, so hold your theory of your type lightly as you learn more. Identifying your type accurately requires a solid understanding of the system and honest self-reflection on your core motives.`
    }
  ];

  return (
    <div className="space-y-8">
      {/* Introduction Card */}
      <Card className="overflow-hidden">
        <CardContent className="py-12 px-16">
          <h1 
            className="text-4xl mb-6"
            style={{ ...styleUtils.headingStyles, color: theme.colors.text }}
          >
            How to Interpret Your Results
          </h1>
          <p
            className="text-lg mb-8"
            style={{ ...styleUtils.bodyStyles, color: theme.colors.text }}
          >
            The Voyance Enneagram Assessment is uniquely designed to provide less unambiguous results than other Enneagram assessments. For this reason, it's likely that your true personality type is one of your top two scores. We encourage you to read the profiles on these types and subjectively evaluate which one resonates the most.
          </p>
          <p
            className="text-lg"
            style={{ ...styleUtils.bodyStyles, color: theme.colors.text }}
          >
            As you continue to evaluate which personality type you relate to most, please keep the following pointers in mind:
          </p>
        </CardContent>
      </Card>

      {/* Content Section Cards */}
      {sections.map((section, index) => (
        <Card key={index} className="overflow-hidden">
          <CardContent className="py-12 px-16">
            <h2 
              className="text-2xl mb-4"
              style={{ ...styleUtils.headingStyles, color: theme.colors.text }}
            >
              {section.title}
            </h2>
            <div
              style={{ 
                ...styleUtils.bodyStyles, 
                color: theme.colors.text,
                lineHeight: '1.7'
              }}
            >
              {section.content.split('\n\n').map((paragraph, i) => (
                <p key={i} className="mb-4 last:mb-0">{paragraph}</p>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}