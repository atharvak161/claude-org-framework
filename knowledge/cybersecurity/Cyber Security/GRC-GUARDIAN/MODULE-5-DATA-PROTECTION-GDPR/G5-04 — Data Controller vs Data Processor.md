---
tags: [guardian, grc, module-5, gdpr, data-controller, data-processor, joint-controller, dpa, liability]
module: 5
cert-coverage: [iso27001-la, cism, crisc, cissp]
difficulty: intermediate
date: 2026-04-17
guardian-refs: ["G5-02 — GDPR Structure Principles Lawful Basis", "G5-03 — Data Subject Rights", "G5-05 — DPIA", "G5-06 — The Role of the DPO", "G4-01 — Organisational Controls — Supplier Security"]
---

# G5-04 — Data Controller vs Data Processor

> [!abstract] What This Note Covers
> By the end of this note, you will understand the precise distinction between data controllers and data processors under GDPR, what each role means in practice, the obligations that apply to each, what must be in a Data Processing Agreement, and how the controller/processor relationship creates accountability and liability across supply chains.

---

## Why This Exists

The controller/processor distinction is one of the most practically important — and most frequently misunderstood — concepts in GDPR. Getting it wrong has real consequences: a processor that incorrectly believes it is acting as a controller will have incomplete compliance obligations; a controller that treats its processor relationships casually will face liability for the processor's failures; and a supplier that fails to comply with Article 28 requirements creates compliance gaps that expose both parties.

Every time personal data flows between organisations — to a cloud provider, a payroll processor, a marketing agency, an outsourced HR function, a call centre — the controller/processor question must be answered. And the answer determines the legal relationship, the contractual requirements, the liability allocation, and the compliance obligations of both parties.

---

## The Three Roles: Controller, Processor, Joint Controller

### Data Controller (Article 4(7))

**Definition**: "The natural or legal person, public authority, agency or other body which, alone or jointly with others, determines the **purposes and means** of the processing of personal data."

**Key concepts:**

**"Determines the purposes"**: The controller decides *why* personal data is processed. What is the goal? What outcome is the processing intended to achieve? A hospital processes patient health data to provide medical care — it determines the purpose.

**"Determines the means"**: The controller decides *how* personal data is processed. This includes essential means (the type of data, which data subjects, the retention period, who can access it) and non-essential means (the specific software, the database architecture, the specific server provider) — the latter can be delegated to the processor.

**The key test for controller status**: Does this entity decide *why* data is processed and the essential parameters of *how*? If yes, it is a controller.

**Controller accountability**: Controllers bear primary accountability under GDPR:
- Must have a lawful basis for processing
- Must comply with all data protection principles
- Must provide privacy notices to data subjects
- Must facilitate data subject rights
- Must conduct DPIAs where required
- Must appoint a DPO where required
- Must implement appropriate security measures (Article 32)
- Must notify the ICO (and data subjects) of breaches (Articles 33–34)
- Must ensure any processors they use comply with GDPR through a DPA

**Fine liability**: Controllers are directly subject to GDPR's enforcement and fine regime. Maximum fines: €20 million or 4% of global annual turnover.

### Data Processor (Article 4(8))

**Definition**: "A natural or legal person, public authority, agency or other body which processes personal data **on behalf of the controller**."

**Key concepts:**

**"On behalf of"**: The processor acts under the controller's authority and on the controller's instructions. The processor does not decide why data is processed — that decision belongs to the controller.

**No independent purpose**: A processor may not process data for its own purposes. If it does, it steps outside its processor role and becomes a controller (with all associated accountability) for that independent processing.

**Examples of processors**: Cloud storage providers (AWS, Azure, Google Cloud); payroll processors; email marketing platforms (Mailchimp, HubSpot); HR software providers (Workday, SAP SuccessFactors); CRM providers (Salesforce); call centre outsourcers; IT managed service providers; translation services; data analytics providers.

**Processor obligations under GDPR:**

Unlike the 1995 Directive, GDPR imposes direct legal obligations on processors — they are no longer merely contractual obligations flowing from the DPA:

- Process only on documented instructions from the controller (Article 28(3)(a))
- Ensure persons authorised to process are bound by confidentiality (Article 28(3)(b))
- Implement appropriate security measures (Article 32)
- Respect rules on engaging sub-processors (Article 28(2))
- Assist the controller with data subject rights (Article 28(3)(e))
- Assist the controller with security, breach notification, DPIA (Article 28(3)(f))
- Delete or return data at the end of the contract (Article 28(3)(g))
- Provide information to demonstrate compliance (Article 28(3)(h))
- Maintain records of processing categories (Article 30(2))
- Notify the controller of breaches "without undue delay" (Article 33(2))
- Comply with international transfer rules (Article 44+)

**Processor fine liability**: Processors are directly subject to GDPR fines for specific violations — particularly processing outside the controller's instructions (making them a controller), failing to implement security, failing to maintain records, and engaging sub-processors without authorisation.

### Joint Controllers (Article 26)

**Definition**: Two or more controllers that **jointly determine the purposes and means** of processing.

**When does joint control arise?** When two or more organisations together decide why and how data is processed — not simply when they share data, but when they share the decision-making authority over the processing.

**Examples of joint controllers:**
- Two companies that run a joint loyalty programme and together decide how customer data is used
- A research consortium where multiple universities collectively design the data processing activities
- A franchisor and franchisee that together determine how customer data is processed in their shared systems
- Facebook (Meta) and websites that implement the Facebook Like button — the CJEU ruled in *Fashion ID* (2019) that the website operator and Facebook are joint controllers for the initial collection and transmission of data

**Joint controller obligations (Article 26):**
- Joint controllers must determine their respective responsibilities between themselves in a transparent arrangement
- The arrangement must specifically determine who fulfils GDPR obligations, particularly regarding data subject rights and breach notification
- The substance of the arrangement must be made available to data subjects
- Data subjects can exercise their rights against any of the joint controllers, regardless of the internal arrangement

**The risk of unrecognised joint control**: Organisations sometimes structure arrangements as controller/processor relationships when, factually, both parties are determining purposes and means. An undeclared joint controller relationship may not have the required Article 26 arrangement in place — a compliance failure that regulators are increasingly identifying and pursuing.

---

## The Controller/Processor Test in Practice

### Identifying the Role: Practical Questions

To determine whether an organisation is a controller, processor, or joint controller for a specific processing activity, ask:

1. **Who decided that this processing should happen?** If Organisation A decides to engage Organisation B to process data, A is (at minimum) a controller — it determined the purpose.

2. **Who decides the essential parameters of the processing?** (What data, which individuals, how long retained, who can access?) If A decides these and B implements them, A is the controller and B is the processor.

3. **Does Organisation B also determine any purposes or essential means independently?** If yes, B may also be a controller (or joint controller with A) for that element.

4. **Does the contract describe the relationship accurately?** A contract labelling a relationship as "processor" does not make it so if the factual reality is that both parties determine purposes and means. ICO and courts look at the substance, not the label.

### Common Scenarios

**Scenario 1: Payroll outsourcing**
A company (controller) engages a payroll bureau (processor). The company decides to run payroll — that's the purpose. The company determines what employee data to process and for how long (essential means). The payroll bureau runs the calculations and makes payments on instructions. The payroll bureau is clearly a processor.

**Scenario 2: LinkedIn Talent Solutions**
An employer uses LinkedIn to source candidates. LinkedIn processes data about LinkedIn users — it is a controller in its own right for those activities. When the employer accesses that data through LinkedIn's platform to contact candidates, the employer becomes a controller for its own recruitment processing. LinkedIn is not the employer's processor — LinkedIn determined its own purposes for collecting and holding user data. This is two controllers, not a controller/processor relationship.

**Scenario 3: Cloud hosting**
A company (controller) stores customer data in an AWS S3 bucket. AWS provides the infrastructure and processes data only on the company's instructions. AWS has no independent purpose for that customer data. AWS is a processor.

**Scenario 4: Marketing agency**
A company (controller) engages a marketing agency to send email campaigns to the company's customer list. The company provides the list; the agency sends the emails on the company's instructions. The agency is a processor. However, if the agency uses the data for its own reporting, benchmarking, or platform development purposes — it becomes a controller (or joint controller) for those activities.

---

## The Data Processing Agreement (DPA) — Article 28

Where a controller uses a processor, **a written contract (the DPA) is mandatory** — Article 28(3) requires it. Processing without a DPA in place violates GDPR.

### Mandatory DPA Content

Article 28(3) specifies what the DPA must stipulate. The processor must:

**(a) Only process data on documented instructions from the controller**, including instructions about international transfers

**(b) Ensure that persons authorised to process personal data have committed to confidentiality or are under an appropriate statutory obligation of confidentiality**

**(c) Implement all security measures required by Article 32** (appropriate technical and organisational measures)

**(d) Respect the rules on sub-processors** — not engage any sub-processor without prior specific or general written authorisation from the controller; impose the same data protection obligations on sub-processors as apply to the processor

**(e) Assist the controller** in fulfilling its obligation to respond to data subject rights requests (taking into account the nature of the processing)

**(f) Assist the controller** in ensuring compliance with security obligations (Article 32), breach notification (Articles 33–34), DPIA (Article 35), and prior consultation (Article 36)

**(g) Delete or return personal data** to the controller after the end of the provision of services, and delete existing copies unless EU or member state law requires storage

**(h) Make available to the controller** all information necessary to demonstrate compliance with Article 28, and allow for and contribute to audits and inspections by the controller or an auditor mandated by the controller

### Standard Contractual Clauses for Processors

The European Commission has published **Standard Contractual Clauses (SCCs) for controller-processor relationships** as part of the 2021 SCC package. These pre-approved clauses satisfy Article 28 requirements when used correctly. Many cloud providers and SaaS vendors offer DPAs based on these SCCs.

### What Good DPA Practice Looks Like

**For controllers**:
- DPA in place before any processing begins — not retrospectively
- DPA reviewed and updated when processing activities change significantly
- DPA requires the processor to notify you of breaches immediately (Article 33(2) requires processors to notify controllers "without undue delay")
- DPA includes right to audit the processor's compliance
- DPA requires the processor to notify you of any sub-processor changes (general authorisation model) or requires specific approval for each sub-processor

**For processors**:
- Ensure all customers have executed a DPA — processing without one is a violation
- Ensure sub-processor DPAs are in place before any sub-processing begins
- Have clear processes for breach notification to controllers (without undue delay)
- Have appropriate records of processing (Article 30(2) RoPA for processors)
- Ensure staff with access to customer data are bound by confidentiality

### Sub-Processors (Article 28(2))

A processor may engage another company to help it perform processing activities — a **sub-processor**. Common sub-processors: cloud infrastructure (AWS, Azure), analytics platforms, backup services.

The controller must authorise the use of sub-processors. There are two models:
- **Specific authorisation**: The controller approves each sub-processor individually
- **General authorisation**: The controller gives a general authorisation for the processor to engage sub-processors, subject to the processor notifying the controller of any additions or changes and the controller having the opportunity to object

The processor must impose on sub-processors the same data protection obligations as the main DPA imposes on the processor. If the sub-processor fails, the processor remains liable to the controller.

**In practice**: Cloud providers like AWS operate as processors for their customers' data and use sub-processors for some elements of their service delivery. They typically offer a "general authorisation" model with a published list of sub-processors and notification of changes.

---

## Liability in the Controller/Processor Relationship

### Controller Liability

Controllers are liable for GDPR violations by their processors if the controller has failed to:
- Only use processors providing sufficient guarantees of GDPR compliance
- Ensure an appropriate DPA is in place
- Properly oversee the processor's compliance

If a breach occurs at the processor, the controller may still be liable to data subjects and to the supervisory authority — because it selected the processor and failed to ensure adequate safeguards.

### Processor Liability

Processors are directly liable for GDPR fines where:
- Processing was carried out outside the controller's instructions (making the processor a controller for that activity)
- Security measures were inadequate (Article 32)
- Sub-processors were engaged without proper authorisation
- Records were not maintained (Article 30(2))
- Other direct processor obligations were not met

### Joint and Several Liability (Article 82)

Where both controller and processor contributed to a breach causing damage to data subjects, both can be held liable. The data subject can claim compensation from either or both. The parties then have the right to seek recovery from each other based on their respective responsibility for the damage.

---

## The Records of Processing Activities for Processors (Article 30(2))

Processors must maintain their own RoPA, recording:
- Name and contact details of each controller on whose behalf they process
- Categories of processing performed on behalf of each controller
- Transfers to third countries (and safeguards)
- Security measures (where possible)

This is separate from the controller's RoPA. Both are required.

---

## Common Mistakes and Failures

**1. Controller/processor mislabelled in contracts.**
Calling a company a "processor" in a contract when, factually, it determines its own purposes for the data (making it a controller). The contractual label does not create the relationship — the substance does. If a cloud AI provider uses customer data to train its own models, it is a controller for that activity, not a processor, regardless of what the DPA says.

**2. No DPA with cloud providers and SaaS tools.**
"We're just using their free tier" or "it's a well-known company so it must be compliant" — neither is a substitute for an executed DPA. Many free-tier services have DPAs available but require the organisation to actively opt into them.

**3. DPA in place but sub-processors not managed.**
The DPA covers the direct relationship. But the processor's sub-processors are not assessed, their DPAs not reviewed, and their changes not monitored. A breach at a sub-processor the controller knew nothing about can still be the controller's liability if adequate oversight was not in place.

**4. No audit right exercised.**
The DPA includes an audit right. The controller has never exercised it. When a breach occurs at the processor, the controller has no independent assurance that the processor was actually compliant — and no evidence that the controller exercised appropriate oversight.

**5. Breach notification delay between processor and controller.**
The processor experiences a breach. They notify the controller 10 days later. The controller's 72-hour notification clock to the ICO runs from when the controller became aware — but GDPR implies this should run from when the processor becomes aware, if the processor notified promptly. An Article 28(3)(f) requirement is that the processor assist the controller with breach notification obligations — "without undue delay" notification from processor to controller is implicit.

**6. Treating all data sharing as processor relationships.**
When organisation A sends data to organisation B for B to use in B's own services (not on A's instructions), B is a controller, not a processor. A proper data sharing arrangement (with appropriate lawful basis and potentially a data sharing agreement) is needed — not a DPA.

---

## Exam Angle

**ISO 27001 Lead Auditor:**
- Supplier security controls (A.5.19–A.5.22) are directly connected to the controller/processor distinction. Auditors will assess whether DPAs are in place with data processors and whether suppliers are appropriately assessed and monitored.
- A finding that the organisation uses a cloud provider without a DPA in place is a GDPR compliance finding (not directly an ISO 27001 nonconformity unless the information security policy addresses GDPR compliance and has been breached) but the auditor may note it as an observation given the significant regulatory risk it creates.

**CISM:**
- Domain 1 (Governance) includes legal and regulatory compliance. The controller/processor framework is a core regulatory concept that CISOs must understand to manage supply chain risk and ensure vendor contracts are compliant.

**CISSP:**
- Domain 1 (Security and Risk Management) covers data privacy and data handling obligations. The controller/processor distinction is specifically testable in the context of third-party data management and contractual obligations.

---

## GUARDIAN's Take

The controller/processor distinction sounds like a legal technicality. In practice, it is the architecture of accountability for personal data in complex organisational environments.

Every organisation today uses dozens — sometimes hundreds — of third-party services that touch personal data. Cloud providers, SaaS platforms, analytics services, payroll processors, marketing tools. Each of these relationships creates either a processor relationship (requiring a DPA) or a separate controller relationship (requiring a different kind of data sharing arrangement). Getting the classification wrong means the wrong legal framework is applied, the wrong obligations are in place, and liability is misallocated.

The practical lesson: treat the controller/processor question as a mandatory first step whenever a new supplier is engaged that will touch personal data. Before the DPA is executed, before data flows, answer the question: is this a processor acting on our instructions, a controller acting on its own, or something in between? The answer determines everything that follows.

And then maintain those DPAs. Review them when processing changes. Exercise the audit rights they grant. Maintain awareness of sub-processors and their changes. This is not bureaucratic box-ticking — it is the practical management of your legal obligations and your data subjects' rights in a world where your data does not stay within your four walls.

---
*Module: Module 5 — Data Protection / GDPR | Guardian Curriculum*
