---
name: 🐛 Bug Report
description: Report a reproducible issue or unexpected behavior in prototypes, docs, or systems.
labels: ["bug", "needs-triage"]
assignees: []

body:
  - type: markdown
    attributes:
      value: |
        Thank you for helping improve the Ascendii Universe foundations!

  - type: textarea
    attributes:
      label: Description
      description: A clear and concise description of the bug.
    validations:
      required: true

  - type: textarea
    attributes:
      label: Steps to Reproduce
      description: Steps to reproduce the behavior (e.g., in a prototype).
      placeholder: |
        1. Go to '...'
        2. Perform '...'
        3. See error
    validations:
      required: true

  - type: textarea
    attributes:
      label: Expected Behavior
      description: What you expected to happen.

  - type: textarea
    attributes:
      label: Screenshots / Logs
      description: Any relevant visuals or error logs.

  - type: textarea
    attributes:
      label: Additional Context
      description: Environment details, related files, or principles impacted.
---
