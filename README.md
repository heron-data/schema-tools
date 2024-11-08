# JSON Schema Builder

https://schematools.herondata.io/

We’ve built a JSON Schema Builder to make creating and editing JSON schemas for structured output much simpler.

While there are a few similar tools out there, we found they lacked key functionality we needed to operationalize document extraction at scale. Editing long, complex JSON schema files manually (sometimes with over 1,000 lines) was taking too much time, so we built this tool to streamline the process.

**Key Features:**
1.	Two-Way Editing: Paste in an existing JSON schema and edit it within the UI.
2.	Data-Type Validations: Easily add validations to fields.
3.	Local Storage & Version History: Track your edits and never lose changes.

We built this in a day to help save us time internally, but we wanted to share it as others might find it useful! The source code is available here: https://github.com/heron-data/json-schema-builder.


# About Heron Data (S20)


At Heron, we use the latest advances in AI and LLMs to automate document-heavy workflows. We serve 130+ customers across financial services—including banking, lending, insurance, and legal. Our primary product automates underwriting for small business lenders and specialty finance companies, eliminating cumbersome manual processes and enabling our customers to provide credit with greater speed, precision, and fairness.
We’re a lean, committed, and fast-growing team with a flat structure and a highly collaborative culture. With over $3M ARR, we’re expanding rapidly and actively hiring for roles in New York and London. Join us!


# Setup

```bash
> pnpm install
> pnpm dev
```
