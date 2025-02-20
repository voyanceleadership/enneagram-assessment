# Type Content Display
#
# This file defines all shared presentation text used across type pages.
# It contains titles, labels, and text patterns that are consistent across
# all Enneagram type descriptions. The content in this file corresponds to
# the structure defined in typeContentSchema.ts.
#
# This text forms the display layer for type content - it defines how
# structural elements should be presented to users while supporting
# localization and consistent terminology.

# Section Titles
# -------------
# Defines the main section headings used on type pages.
# These correspond to the TYPE_SECTION_IDS in the schema.
sections:
  snapshot: "Type Snapshot"
  summary: "Type Summary"
  description: "Type Description"
  identification: "Type Identification"
  misidentifications: "Misidentifications"
  levels: "Levels of Development"
  misconceptions: "Common Misconceptions"
  relatedTypes: "Related Types"
  growth: "Growth Practices"
  examples: "Famous Examples"

# Subsection Titles
# ----------------
# Defines headings for subsections within main sections.
# These correspond to TYPE_SUBSECTION_IDS in the schema.
subsections:
  # Snapshot subsections - Quick overview of key type characteristics
  briefDescription: "Brief Description"
  topPriority: "Top Priority"
  secondaryDesires: "Secondary Desires"
  biggestFear: "Biggest Fear"
  secondaryFears: "Secondary Fears"
  atTheirBest: "At Their Best"
  underStress: "Under Stress"
  wakeUpCall: "Wake-Up Call"
  mentalHabit: "Mental Habit"
  characteristicVice: "Characteristic Vice"
  innerStory: "Inner Story"
  keyToGrowth: "Key to Growth"

  # Identification subsections - Help users identify their type
  mightBe: "You Might Be This Type If..."
  probablyNot: "You're Probably Not This Type If..."

  # Development level subsections - Describe behavior at different levels
  healthy: "Healthy Level"
  average: "Average Level"
  unhealthy: "Unhealthy Level"

  # Related types subsections - Describe connections to other types
  wings: "Wing Types"
  lines: "Line Types"

# Type Names
# ----------
# The primary name/title for each Enneagram type.
# Used in headings, navigation, and references to types.
typeNames:
  1: "Reformer"
  2: "Helper"
  3: "Achiever"
  4: "Individualist"
  5: "Investigator"
  6: "Loyalist"
  7: "Enthusiast"
  8: "Challenger"
  9: "Peacemaker"

# Type Numbers as Words
# -------------------
# Word form of type numbers, used in natural language descriptions
# and dynamic text patterns.
typeNumberWords:
  1: "One"
  2: "Two"
  3: "Three"
  4: "Four"
  5: "Five"
  6: "Six"
  7: "Seven"
  8: "Eight"
  9: "Nine"

# Dynamic Text Patterns
# -------------------
# Templates for generating dynamic text about types.
# Use {type} as placeholder for the type number word.
# These patterns ensure consistent language when referring to types.
patterns:
  # Type identification patterns
  mightBeType: "You Might Be a {type} If..."
  probablyNotType: "You're Probably Not a {type} If..."
  typesMisidentifyingAs: "Types That May Misidentify as {type}s"
  typeMayMisidentifyAs: "{type}s May Misidentify As..."
  
  # Wing and line connection patterns
  wingType: "Type {type} with a {wingType} Wing"
  lineConnection: "Connection to Type {type}"
  
  # Development level patterns
  healthyDescription: "At their healthiest, Type {type}s are..."
  averageDescription: "At average levels, Type {type}s tend to..."
  unhealthyDescription: "At unhealthy levels, Type {type}s may..."