#!/bin/bash

# Base directory for the components
BASE_DIR="src/components/enneagram/types"

# Create main directories
mkdir -p "$BASE_DIR/components"
mkdir -p "$BASE_DIR/sections"

# Create shared components
SHARED_COMPONENTS=(
    "SectionHeader"
    "ExpandableContent"
    "SnapshotCard"
    "BulletList"
    "TypeSymbol"
)

for component in "${SHARED_COMPONENTS[@]}"; do
    echo "Creating shared component: $component"
    echo "// src/components/enneagram/types/components/${component}.tsx" > "$BASE_DIR/components/${component}.tsx"
done

# Create section components
SECTION_COMPONENTS=(
    "TypeHeader"
    "TypeSnapshot"
    "TypeSummary"
    "TypeDescription"
    "TypeIdentification"
    "DevelopmentLevels"
    "Misconceptions"
    "RelatedTypes"
    "GrowthPractices"
    "FamousExamples"
)

for component in "${SECTION_COMPONENTS[@]}"; do
    echo "Creating section component: $component"
    echo "// src/components/enneagram/types/sections/${component}.tsx" > "$BASE_DIR/sections/${component}.tsx"
done

# Create main page component
echo "Creating main EnneagramTypePage component"
echo "// src/components/enneagram/types/EnneagramTypePage.tsx" > "$BASE_DIR/EnneagramTypePage.tsx"

echo "File structure created successfully!"