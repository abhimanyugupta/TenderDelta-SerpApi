import { Tender, MaterialChange, StructuredRequirement, BOQItemChange, ConflictRecord, TenderDeadline, ActionTask, TenderDocument } from '../types';

export const DEMO_DOCUMENTS: TenderDocument[] = [
  {
    id: 'doc-nit-01',
    tenderId: 'tender-demo-001',
    name: 'NIT_089_T04_Original_Tender.pdf',
    filename: 'NIT_089_T04_Original_Tender.pdf',
    title: 'Notice Inviting Tender & Technical Specifications (Original)',
    type: 'ORIGINAL_NIT',
    versionNumber: 1,
    versionLabel: 'v1.0 (Original)',
    publishedDate: '2026-07-28',
    uploadedDate: '2026-07-28',
    pageCount: 68,
    fileSizeBytes: 4280000,
    provenance: 'SYNTHETIC_DEMO',
    lifecycleStatus: 'PARSED',
    summary: 'Original RFP containing General Conditions of Contract (GCC), Special Conditions (SCC), Technical Specifications for GPU Clusters, and Forms.',
    sections: [
      {
        id: 'sec-1',
        sectionNumber: 'Section 1.1',
        title: 'Tender Notice & Critical Dates',
        pageNumber: 3,
        content: `TENDER NOTICE NO: IISEAR/PROC/CC/2026/089-T04. Online electronic bids are invited through Central Public Procurement Portal (CPPP) for Supply, Installation, Testing & Commissioning of High-Performance AI & Research Computing Infrastructure. Pre-bid meeting date: 05-Aug-2026 at 11:00 AM IST. Bid Submission End Date: 12-Aug-2026 up to 15:00 hrs. Technical Bid Opening Date: 13-Aug-2026 at 15:30 hrs.`
      },
      {
        id: 'sec-2',
        sectionNumber: 'Section 3.2',
        title: 'Minimum Eligibility Criteria - Financial Turnover',
        pageNumber: 9,
        content: `Clause 3.2.1: The bidder must have an Average Annual Financial Turnover of at least INR 10.00 Crores (Rupees Ten Crores only) during the last three financial years (FY 2022-23, 2023-24, and 2024-25). Audited Balance Sheets and Profit & Loss statements certified by a practicing Chartered Accountant with valid UDIN must be submitted.`
      },
      {
        id: 'sec-3',
        sectionNumber: 'Section 4.2',
        title: 'Earnest Money Deposit (EMD) and Tender Fee',
        pageNumber: 14,
        content: `Clause 4.2: The bidder shall furnish an EMD of INR 18,50,000/- (Rupees Eighteen Lakh Fifty Thousand only) by way of Demand Draft / Banker's Cheque / Bank Guarantee from any Scheduled Commercial Bank in favour of Director, IISEAR. Micro and Small Enterprises (MSEs) registered with UDYAM are exempt from payment of EMD subject to submission of valid registration certificate.`
      },
      {
        id: 'sec-4',
        sectionNumber: 'Section 5.4',
        title: 'OEM Track Record & Eligibility Criteria',
        pageNumber: 22,
        content: `Clause 5.4.3: The Original Equipment Manufacturer (OEM) of servers must have continuous manufacturing operations and registered legal presence in India for a minimum of 7 (seven) continuous years as on bid submission date. OEM must have supplied at least 3 similar AI computing clusters to IITs/IISc/NITs/CSIR labs.`
      },
      {
        id: 'sec-5',
        sectionNumber: 'Section 6.1',
        title: 'Technical Specifications - Compute Node Memory & Fabric',
        pageNumber: 31,
        content: `Clause 6.1.4: Each GPU Compute Node (Total 8 Nodes) must be equipped with Dual Socket 64-Core Processors, minimum 512 GB DDR5 4800MHz ECC Registered RAM (scalable to 2TB), 4x 80GB H100 SXM5 GPUs, and 1x Single-port 100Gbps InfiniBand HDR Host Channel Adapter.`
      },
      {
        id: 'sec-6',
        sectionNumber: 'Annexure VII',
        title: 'Form C - EMD Submission Checklist',
        pageNumber: 64,
        content: `Annexure VII Form C: The bidder shall deposit an Earnest Money Deposit (EMD) of INR 20,00,000/- (Rupees Twenty Lakhs only) along with the Technical Envelope. Bids without valid EMD proof or UDYAM registration will be summarily rejected.`
      }
    ]
  },
  {
    id: 'doc-corr-01',
    tenderId: 'tender-demo-001',
    name: 'Corrigendum_1_Extension_and_EMD.pdf',
    filename: 'Corrigendum_1_Extension_and_EMD.pdf',
    title: 'Corrigendum No. 1 - Pre-Bid Schedule & EMD Rectification',
    type: 'CORRIGENDUM',
    versionNumber: 2,
    versionLabel: 'v2.0 (Corrigendum 1)',
    publishedDate: '2026-08-03',
    uploadedDate: '2026-08-03',
    pageCount: 4,
    fileSizeBytes: 620000,
    provenance: 'SYNTHETIC_DEMO',
    lifecycleStatus: 'PARSED',
    summary: 'Clarification regarding EMD discrepancies between Section 4.2 and Annexure VII, and rescheduling of pre-bid meeting.',
    sections: [
      {
        id: 'sec-c1-1',
        sectionNumber: 'Clause C1.1',
        title: 'Rectification of EMD Amount',
        pageNumber: 1,
        content: `Reference Section 4.2 (Page 14) vs Annexure VII (Page 64): It is hereby clarified that the applicable Earnest Money Deposit (EMD) is INR 18,50,000/- (Rupees Eighteen Lakh Fifty Thousand only). The typographical mention of INR 20,00,000/- in Annexure VII Form C stands superseded and deleted. MSE exemption as per GFR Rule 170 applies.`
      },
      {
        id: 'sec-c1-2',
        sectionNumber: 'Clause C1.2',
        title: 'Pre-Bid Meeting Mode',
        pageNumber: 2,
        content: `The Pre-bid meeting scheduled for 05-Aug-2026 will now be conducted in HYBRID mode (Physical at Senate Hall + Virtual Webex link to be shared on portal 24 hours prior). Prospective bidders may submit written queries up to 04-Aug-2026 17:00 hrs.`
      }
    ]
  },
  {
    id: 'doc-prebid-01',
    tenderId: 'tender-demo-001',
    name: 'Pre_Bid_Clarifications_Reply_Matrix.pdf',
    filename: 'Pre_Bid_Clarifications_Reply_Matrix.pdf',
    title: 'Pre-Bid Meeting Clarifications & Response Matrix (54 Queries)',
    type: 'PRE_BID_CLARIFICATION',
    versionNumber: 3,
    versionLabel: 'v3.0 (Pre-Bid Clarification)',
    publishedDate: '2026-08-07',
    uploadedDate: '2026-08-07',
    pageCount: 16,
    fileSizeBytes: 1840000,
    provenance: 'SYNTHETIC_DEMO',
    lifecycleStatus: 'PARSED',
    summary: 'Official technical & commercial responses to bidder queries raised during pre-bid conference.',
    sections: [
      {
        id: 'sec-pb-1',
        sectionNumber: 'Query #14',
        title: 'Clarification on RAM Capacity for LLM Fine-Tuning Workloads',
        pageNumber: 4,
        content: `Query: Considering distributed Transformer training and large in-memory dataset staging, 512GB RAM per node is restrictive. We request 1024GB (1TB) RAM per node. Institute Reply: Request accepted. The RAM per GPU node is hereby revised to 1024 GB (1TB) DDR5 4800MHz ECC. Revised BOQ to be published accordingly.`
      },
      {
        id: 'sec-pb-2',
        sectionNumber: 'Query #22',
        title: 'Relaxation on OEM Continuous Presence in India',
        pageNumber: 6,
        content: `Query: Clause 5.4.3 requires 7 years continuous OEM manufacturing presence. Several leading AI accelerator OEMs entered India 5 years ago. Request relaxation to 5 years. Institute Reply: Accepted. OEM continuous operating presence in India is relaxed from 7 years to 5 (five) continuous years.`
      },
      {
        id: 'sec-pb-3',
        sectionNumber: 'Query #39',
        title: 'Public Procurement (Preference to Make in India) Order',
        pageNumber: 11,
        content: `Query: Is MII Class-I local supplier certificate mandatory at technical bid stage? Institute Reply: Yes. As per DPIIT Order P-45021/2/2017-PP (BE-II), bidders must submit a statutory auditor certificate certifying minimum 50% local content with detailed computation breakdown.`
      }
    ]
  },
  {
    id: 'doc-corr-02',
    tenderId: 'tender-demo-001',
    name: 'Corrigendum_2_Substantive_Amendments.pdf',
    filename: 'Corrigendum_2_Substantive_Amendments.pdf',
    title: 'Corrigendum No. 2 - Substantive Eligibility & Deadline Extension',
    type: 'CORRIGENDUM',
    versionNumber: 4,
    versionLabel: 'v4.0 (Corrigendum 2)',
    publishedDate: '2026-08-09',
    uploadedDate: '2026-08-09',
    pageCount: 6,
    fileSizeBytes: 980000,
    provenance: 'SYNTHETIC_DEMO',
    lifecycleStatus: 'PARSED',
    summary: 'Major amendments in Financial Eligibility Turnover, Submission Deadline extension, and On-site OEM SLA.',
    sections: [
      {
        id: 'sec-c2-1',
        sectionNumber: 'Clause C2.1',
        title: 'Amendment in Submission Deadline',
        pageNumber: 1,
        content: `Due to substantial revisions in technical specifications and BOQ, the Bid Submission End Date is hereby EXTENDED from 12-Aug-2026 (15:00 hrs) to 19-Aug-2026 (15:00 hrs IST). Technical bid opening will be on 20-Aug-2026 at 15:30 hrs IST.`
      },
      {
        id: 'sec-c2-2',
        sectionNumber: 'Clause C2.2',
        title: 'Revision in Average Annual Financial Turnover Threshold',
        pageNumber: 2,
        content: `Section 3.2, Clause 3.2.1 stands amended as: 'The bidder must have an Average Annual Financial Turnover of at least INR 15.00 Crores (Rupees Fifteen Crores only) over the last three financial years (FY 2022-23, 2023-24, and 2024-25)' in lieu of earlier INR 10.00 Crores.`
      },
      {
        id: 'sec-c2-3',
        sectionNumber: 'Clause C2.3',
        title: 'Mandatory OEM Tier-1 4-Hour On-Site Support Commitment',
        pageNumber: 3,
        content: `Addition to Clause 8.2 (Warranty & SLA): The bidder must submit a specific Back-to-Back OEM Warranty Commitment letter with guaranteed 4-hour on-site engineer response time and 24x7 mission-critical parts availability in Pune/Mumbai region.`
      },
      {
        id: 'sec-c2-4',
        sectionNumber: 'Clause C2.4',
        title: 'Portal Payment Gateway for Tender Processing Fee',
        pageNumber: 4,
        content: `Payment of Tender Processing Fee of INR 5,000/- must now be executed strictly through CPPP e-payment gateway. Offline DD/RTGS slips will no longer be accepted.`
      }
    ]
  },
  {
    id: 'doc-boq-02',
    tenderId: 'tender-demo-001',
    name: 'Revised_Financial_BOQ_v2.xlsx',
    filename: 'Revised_Financial_BOQ_v2.xlsx',
    title: 'Revised Financial Bill of Quantities (BOQ_REV_V2)',
    type: 'REVISED_BOQ',
    versionNumber: 5,
    versionLabel: 'v5.0 (Revised BOQ)',
    publishedDate: '2026-08-09',
    uploadedDate: '2026-08-09',
    pageCount: 3,
    fileSizeBytes: 310000,
    provenance: 'SYNTHETIC_DEMO',
    lifecycleStatus: 'PARSED',
    summary: 'Updated Excel pricing schedule incorporating 1TB RAM per node, 4x InfiniBand switches, and active optical cables.',
    sections: [
      {
        id: 'sec-boq-1',
        sectionNumber: 'Schedule A',
        title: 'Item 1.01 - GPU Compute Nodes',
        pageNumber: 1,
        content: `Item 1.01: 8 Nodes AI GPU Compute Server with Dual AMD EPYC 9654, 1024 GB (1TB) DDR5 RAM, 4x NVIDIA H100 80GB SXM5. Unit: Set. Qty: 8. Original Spec was 512GB RAM.`
      },
      {
        id: 'sec-boq-2',
        sectionNumber: 'Schedule B',
        title: 'Item 2.03 - 100Gbps InfiniBand Fabric Switches',
        pageNumber: 2,
        content: `Item 2.03: Managed 32-Port 100Gbps HDR InfiniBand Switches. Quantity revised from 2 Units to 4 Units to support non-blocking spine-leaf interconnect topology.`
      },
      {
        id: 'sec-boq-3',
        sectionNumber: 'Schedule B',
        title: 'Item 2.05 - Active Optical Cabling (AOC) 100G',
        pageNumber: 2,
        content: `Item 2.05: 100G QSFP28 Active Optical Cables (3m & 5m). Newly inserted line item. Qty: 32 Nos.`
      }
    ]
  }
];

export const DEMO_CHANGES: MaterialChange[] = [
  {
    id: 'chg-001',
    tenderId: 'tender-demo-001',
    category: 'TURNOVER',
    changeType: 'THRESHOLD_CHANGED',
    materiality: 'CRITICAL',
    confidence: 'HIGH',
    confidenceReason: 'Explicit numeric threshold amendment in Corrigendum 2 replacing original NIT clause 3.2.1.',
    title: 'Average Annual Financial Turnover Threshold Increased by 50%',
    requirementKey: 'FINANCIAL_TURNOVER_THRESHOLD',
    originalText: 'The bidder must have an Average Annual Financial Turnover of at least INR 10.00 Crores (Rupees Ten Crores only) during the last three financial years (FY 2022-23, 2023-24, and 2024-25).',
    updatedText: "The bidder must have an Average Annual Financial Turnover of at least INR 15.00 Crores (Rupees Fifteen Crores only) over the last three financial years (FY 2022-23, 2023-24, and 2024-25) in lieu of earlier INR 10.00 Crores.",
    beforeValue: '₹10.00 Crore',
    afterValue: '₹15.00 Crore (+50%)',
    impactExplanation: 'Bidders with turnover between ₹10 Cr and ₹15 Cr are now strictly disqualified. Re-verification of 3-year audited accounts & UDIN CA certificate is immediately required.',
    invalidatesText: 'Previous CA turnover certificate of ₹10 Cr minimum validity is invalidated.',
    actionRequired: 'Verify company 3-year turnover against revised ₹15 Cr threshold; obtain fresh CA certificate with revised UDIN referencing Corrigendum 2.',
    unresolvedAmbiguity: 'None. Clear amendment.',
    sourceCitation: {
      documentId: 'doc-corr-02',
      documentName: 'Corrigendum_2_Substantive_Amendments.pdf',
      pageNumber: 2,
      sectionNumber: 'Clause C2.2',
      clauseTitle: 'Revision in Average Annual Financial Turnover Threshold',
      exactSnippet: "The bidder must have an Average Annual Financial Turnover of at least INR 15.00 Crores (Rupees Fifteen Crores only) over the last three financial years..."
    },
    previousCitation: {
      documentId: 'doc-nit-01',
      documentName: 'NIT_089_T04_Original_Tender.pdf',
      pageNumber: 9,
      sectionNumber: 'Clause 3.2.1',
      clauseTitle: 'Minimum Eligibility Criteria - Financial Turnover',
      exactSnippet: "The bidder must have an Average Annual Financial Turnover of at least INR 10.00 Crores..."
    },
    affectedDocuments: ['NIT_089_T04_Original_Tender.pdf', 'Corrigendum_2_Substantive_Amendments.pdf'],
    relevantRoles: ['BID_MANAGER', 'FINANCE', 'LEGAL_COMPLIANCE'],
    verificationStatus: 'CONFIRMED',
    reviewedBy: 'Finance reviewer',
    reviewedAt: '2026-08-10'
  },
  {
    id: 'chg-002',
    tenderId: 'tender-demo-001',
    category: 'DEADLINE',
    changeType: 'DEADLINE_CHANGED',
    materiality: 'CRITICAL',
    confidence: 'HIGH',
    confidenceReason: 'Clear date revision table in Corrigendum 2 extends submission by 7 calendar days.',
    title: 'Bid Submission Deadline Extended by 7 Days',
    requirementKey: 'SUBMISSION_DEADLINE',
    originalText: 'Bid Submission End Date: 12-Aug-2026 up to 15:00 hrs. Technical Bid Opening Date: 13-Aug-2026 at 15:30 hrs.',
    updatedText: 'Bid Submission End Date is hereby EXTENDED from 12-Aug-2026 (15:00 hrs) to 19-Aug-2026 (15:00 hrs IST). Technical bid opening will be on 20-Aug-2026 at 15:30 hrs IST.',
    beforeValue: '12-Aug-2026 15:00 IST',
    afterValue: '19-Aug-2026 15:00 IST (+7 Days)',
    impactExplanation: 'Provides additional window to accommodate revised BOQ pricing, updated OEM warranty authorization letters, and MII auditor certificate.',
    invalidatesText: 'Previous internal bid sign-off freeze date of 10-Aug-2026.',
    actionRequired: 'Update master proposal schedule, bank guarantee validity dates (must be minimum 180 days from revised opening date 20-Aug-2026).',
    sourceCitation: {
      documentId: 'doc-corr-02',
      documentName: 'Corrigendum_2_Substantive_Amendments.pdf',
      pageNumber: 1,
      sectionNumber: 'Clause C2.1',
      clauseTitle: 'Amendment in Submission Deadline',
      exactSnippet: "Bid Submission End Date is hereby EXTENDED from 12-Aug-2026 (15:00 hrs) to 19-Aug-2026 (15:00 hrs IST)."
    },
    previousCitation: {
      documentId: 'doc-nit-01',
      documentName: 'NIT_089_T04_Original_Tender.pdf',
      pageNumber: 3,
      sectionNumber: 'Section 1.1',
      clauseTitle: 'Tender Notice & Critical Dates',
      exactSnippet: "Bid Submission End Date: 12-Aug-2026 up to 15:00 hrs."
    },
    affectedDocuments: ['NIT_089_T04_Original_Tender.pdf', 'Corrigendum_2_Substantive_Amendments.pdf'],
    relevantRoles: ['BID_MANAGER', 'OPERATIONS', 'FINANCE'],
    verificationStatus: 'CONFIRMED',
    reviewedBy: 'Bid management reviewer',
    reviewedAt: '2026-08-09'
  },
  {
    id: 'chg-003',
    tenderId: 'tender-demo-001',
    category: 'TECHNICAL',
    changeType: 'BOQ_CHANGED',
    materiality: 'HIGH',
    confidence: 'HIGH',
    confidenceReason: 'Pre-bid Query #14 response accepted and translated into Revised BOQ Schedule A Item 1.01.',
    title: 'GPU Compute Nodes RAM Doubled from 512GB to 1TB per Node',
    requirementKey: 'GPU_NODE_RAM_SPEC',
    originalText: 'Each GPU Compute Node (Total 8 Nodes) must be equipped with Dual Socket 64-Core Processors, minimum 512 GB DDR5 4800MHz ECC Registered RAM...',
    updatedText: '8 Nodes AI GPU Compute Server with Dual AMD EPYC 9654, 1024 GB (1TB) DDR5 RAM, 4x NVIDIA H100 80GB SXM5. Unit: Set. Qty: 8. (Pre-bid Query #14 response accepted).',
    beforeValue: '512 GB DDR5 per node (4 TB Total)',
    afterValue: '1024 GB (1TB) DDR5 per node (8 TB Total)',
    impactExplanation: 'Substantial cost impact. RAM bill of materials doubles across 8 servers (+4TB total DDR5 ECC enterprise server memory). OEM quotes must be re-baselined.',
    invalidatesText: 'Previous OEM quotation based on 512GB configuration.',
    actionRequired: 'Request revised OEM BOM and pricing for 8x servers with 1024GB DDR5 memory modules.',
    sourceCitation: {
      documentId: 'doc-boq-02',
      documentName: 'Revised_Financial_BOQ_v2.xlsx',
      pageNumber: 1,
      sectionNumber: 'Schedule A',
      clauseTitle: 'Item 1.01 - GPU Compute Nodes',
      exactSnippet: "Item 1.01: 8 Nodes AI GPU Compute Server with Dual AMD EPYC 9654, 1024 GB (1TB) DDR5 RAM..."
    },
    previousCitation: {
      documentId: 'doc-nit-01',
      documentName: 'NIT_089_T04_Original_Tender.pdf',
      pageNumber: 31,
      sectionNumber: 'Clause 6.1.4',
      clauseTitle: 'Technical Specifications - Compute Node Memory',
      exactSnippet: "minimum 512 GB DDR5 4800MHz ECC Registered RAM (scalable to 2TB)..."
    },
    affectedDocuments: ['NIT_089_T04_Original_Tender.pdf', 'Pre_Bid_Clarifications_Reply_Matrix.pdf', 'Revised_Financial_BOQ_v2.xlsx'],
    relevantRoles: ['TECHNICAL', 'FINANCE', 'BID_MANAGER'],
    verificationStatus: 'CONFIRMED'
  },
  {
    id: 'chg-004',
    tenderId: 'tender-demo-001',
    category: 'LOCAL_CONTENT',
    changeType: 'DOCUMENT_REQUIREMENT_CHANGED',
    materiality: 'HIGH',
    confidence: 'HIGH',
    confidenceReason: 'Pre-Bid reply query #39 mandates statutory auditor certified local content declaration.',
    title: 'New Mandatory Submission: Make in India Class-I Auditor Certificate',
    requirementKey: 'MII_LOCAL_CONTENT_CERT',
    originalText: 'Standard self-declaration for local content compliance as per General Financial Rules (GFR).',
    updatedText: 'Bidders must submit a statutory auditor certificate certifying minimum 50% local content with detailed computation breakdown as per DPIIT Order P-45021/2/2017-PP (BE-II).',
    beforeValue: 'Self-declaration letter',
    afterValue: 'Statutory Auditor Certificate (Min 50% Local Content)',
    impactExplanation: 'Non-submission in technical envelope will result in non-responsiveness and rejection at Stage-1 technical evaluation.',
    invalidatesText: 'Self-declaration draft on company letterhead.',
    actionRequired: 'Coordinate with statutory auditor / cost accountant to audit server assembly & integration local value-add and issue certificate with valid UDIN.',
    sourceCitation: {
      documentId: 'doc-prebid-01',
      documentName: 'Pre_Bid_Clarifications_Reply_Matrix.pdf',
      pageNumber: 11,
      sectionNumber: 'Query #39',
      clauseTitle: 'Public Procurement Order Make in India',
      exactSnippet: "bidders must submit a statutory auditor certificate certifying minimum 50% local content with detailed computation breakdown."
    },
    affectedDocuments: ['Pre_Bid_Clarifications_Reply_Matrix.pdf'],
    relevantRoles: ['LEGAL_COMPLIANCE', 'FINANCE', 'BID_MANAGER'],
    verificationStatus: 'CONFIRMED'
  },
  {
    id: 'chg-005',
    tenderId: 'tender-demo-001',
    category: 'EXPERIENCE',
    changeType: 'ELIGIBILITY_CHANGED',
    materiality: 'HIGH',
    confidence: 'HIGH',
    confidenceReason: 'Relaxation granted in Pre-Bid reply query #22 expands OEM eligibility.',
    title: 'OEM Continuous Presence in India Relaxed from 7 Years to 5 Years',
    requirementKey: 'OEM_PRESENCE_YEARS',
    originalText: 'The Original Equipment Manufacturer (OEM) of servers must have continuous manufacturing operations and registered legal presence in India for a minimum of 7 (seven) continuous years...',
    updatedText: 'OEM continuous operating presence in India is relaxed from 7 years to 5 (five) continuous years.',
    beforeValue: '7 Continuous Years',
    afterValue: '5 Continuous Years (Relaxed)',
    impactExplanation: 'Allows partnership with newer global AI server hardware OEMs registered in India since 2021.',
    actionRequired: 'Verify OEM incorporation certificate date in India to ensure >5 years compliant.',
    sourceCitation: {
      documentId: 'doc-prebid-01',
      documentName: 'Pre_Bid_Clarifications_Reply_Matrix.pdf',
      pageNumber: 6,
      sectionNumber: 'Query #22',
      clauseTitle: 'Relaxation on OEM Continuous Presence in India',
      exactSnippet: "OEM continuous operating presence in India is relaxed from 7 years to 5 (five) continuous years."
    },
    previousCitation: {
      documentId: 'doc-nit-01',
      documentName: 'NIT_089_T04_Original_Tender.pdf',
      pageNumber: 22,
      sectionNumber: 'Clause 5.4.3',
      clauseTitle: 'OEM Track Record & Eligibility Criteria',
      exactSnippet: "registered legal presence in India for a minimum of 7 (seven) continuous years..."
    },
    affectedDocuments: ['NIT_089_T04_Original_Tender.pdf', 'Pre_Bid_Clarifications_Reply_Matrix.pdf'],
    relevantRoles: ['LEGAL_COMPLIANCE', 'BID_MANAGER', 'TECHNICAL'],
    verificationStatus: 'CONFIRMED'
  },
  {
    id: 'chg-006',
    tenderId: 'tender-demo-001',
    category: 'EMD',
    changeType: 'CLARIFICATION',
    materiality: 'MEDIUM',
    confidence: 'HIGH',
    confidenceReason: 'Corrigendum 1 explicitly resolves internal conflict between NIT Section 4.2 and Annexure VII.',
    title: 'EMD Amount Confirmed at ₹18.50 Lakhs (Annexure VII Typo of ₹20L Deleted)',
    requirementKey: 'EMD_AMOUNT_SPEC',
    originalText: 'Section 4.2 stated ₹18,50,000/- while Annexure VII Form C stated ₹20,00,000/-.',
    updatedText: 'Applicable Earnest Money Deposit (EMD) is INR 18,50,000/-. Typographical mention of INR 20,00,000/- in Annexure VII Form C stands superseded and deleted.',
    beforeValue: 'Ambiguous (₹18.50 L vs ₹20.00 L)',
    afterValue: '₹18,50,000/- Confirmed',
    impactExplanation: 'Prevents excess BG block of ₹1.50 Lakhs. MSE/UDYAM exemption clause re-affirmed.',
    invalidatesText: 'Draft Bank Guarantee preparation for ₹20,00,000/-.',
    actionRequired: 'Instruct bank treasury to issue EMD BG for exact amount ₹18,50,000/- valid for 225 days.',
    sourceCitation: {
      documentId: 'doc-corr-01',
      documentName: 'Corrigendum_1_Extension_and_EMD.pdf',
      pageNumber: 1,
      sectionNumber: 'Clause C1.1',
      clauseTitle: 'Rectification of EMD Amount',
      exactSnippet: "It is hereby clarified that the applicable Earnest Money Deposit (EMD) is INR 18,50,000/-..."
    },
    affectedDocuments: ['NIT_089_T04_Original_Tender.pdf', 'Corrigendum_1_Extension_and_EMD.pdf'],
    relevantRoles: ['FINANCE', 'BID_MANAGER'],
    verificationStatus: 'CONFIRMED'
  },
  {
    id: 'chg-007',
    tenderId: 'tender-demo-001',
    category: 'EQUIPMENT',
    changeType: 'QUANTITY_CHANGED',
    materiality: 'MEDIUM',
    confidence: 'HIGH',
    confidenceReason: 'Revised BOQ Schedule B Item 2.03 increases InfiniBand Switch quantity from 2 to 4.',
    title: 'InfiniBand 100Gbps Switches Quantity Increased from 2 to 4 Units',
    requirementKey: 'INFINIBAND_SWITCH_QTY',
    originalText: 'Item 2.03: 2 Units Managed 32-Port 100Gbps HDR InfiniBand Switches.',
    updatedText: 'Item 2.03: Managed 32-Port 100Gbps HDR InfiniBand Switches. Quantity revised from 2 Units to 4 Units to support non-blocking spine-leaf topology.',
    beforeValue: '2 Switches',
    afterValue: '4 Switches (+100%)',
    impactExplanation: 'Requires additional rack units, power distribution unit (PDU) sockets, and 32x optical cables.',
    actionRequired: 'Update network interconnect pricing and rack layout schematic in technical response volume.',
    sourceCitation: {
      documentId: 'doc-boq-02',
      documentName: 'Revised_Financial_BOQ_v2.xlsx',
      pageNumber: 2,
      sectionNumber: 'Schedule B',
      clauseTitle: 'Item 2.03 - InfiniBand Fabric Switches',
      exactSnippet: "Quantity revised from 2 Units to 4 Units to support non-blocking spine-leaf interconnect topology."
    },
    affectedDocuments: ['Revised_Financial_BOQ_v2.xlsx'],
    relevantRoles: ['TECHNICAL', 'FINANCE'],
    verificationStatus: 'CONFIRMED'
  },
  {
    id: 'chg-008',
    tenderId: 'tender-demo-001',
    category: 'WARRANTY',
    changeType: 'ADDED',
    materiality: 'MEDIUM',
    confidence: 'HIGH',
    confidenceReason: 'Corrigendum 2 Clause C2.3 introduces mandatory OEM SLA warranty annexure.',
    title: 'New SLA Condition: 4-Hour On-Site Support Commitment with Local Spares Depot',
    requirementKey: 'WARRANTY_SLA_4HOUR',
    originalText: 'Standard 3-year comprehensive on-site warranty with NBD (Next Business Day) response.',
    updatedText: 'The bidder must submit a specific Back-to-Back OEM Warranty Commitment letter with guaranteed 4-hour on-site engineer response time and 24x7 mission-critical parts availability in Pune/Mumbai region.',
    beforeValue: 'Next Business Day (NBD)',
    afterValue: '4-Hour On-Site SLA + Local Spares',
    impactExplanation: 'OEM must provide dedicated high-severity escalation matrix and regional spares warehouse certificate.',
    actionRequired: 'Obtain customized MAF (Manufacturer Authorization Form) containing 4-hour clause wording from OEM.',
    sourceCitation: {
      documentId: 'doc-corr-02',
      documentName: 'Corrigendum_2_Substantive_Amendments.pdf',
      pageNumber: 3,
      sectionNumber: 'Clause C2.3',
      clauseTitle: 'Mandatory OEM Tier-1 4-Hour On-Site Support Commitment',
      exactSnippet: "The bidder must submit a specific Back-to-Back OEM Warranty Commitment letter with guaranteed 4-hour on-site engineer response time..."
    },
    affectedDocuments: ['NIT_089_T04_Original_Tender.pdf', 'Corrigendum_2_Substantive_Amendments.pdf'],
    relevantRoles: ['TECHNICAL', 'OPERATIONS', 'LEGAL_COMPLIANCE'],
    verificationStatus: 'CONFIRMED'
  },
  {
    id: 'chg-009',
    tenderId: 'tender-demo-001',
    category: 'BOQ',
    changeType: 'ADDED',
    materiality: 'LOW',
    confidence: 'HIGH',
    confidenceReason: 'Newly inserted line item in Revised BOQ for active optical cables.',
    title: 'New Line Item: 32 Nos 100G Active Optical Cables (AOC) Added in BOQ',
    requirementKey: 'BOQ_ITEM_AOC_CABLES',
    originalText: 'Not listed separately in original BOQ schedule (bundled in node accessories).',
    updatedText: 'Item 2.05: 100G QSFP28 Active Optical Cables (3m & 5m). Newly inserted line item. Qty: 32 Nos.',
    beforeValue: '0 (Bundled)',
    afterValue: '32 Nos (Separate line item)',
    impactExplanation: 'Must provide individual unit rate in revised Excel BOQ table; leaving blank will invalidate commercial bid.',
    actionRequired: 'Ensure pricing is populated for Item 2.05 in electronic BOQ sheet.',
    sourceCitation: {
      documentId: 'doc-boq-02',
      documentName: 'Revised_Financial_BOQ_v2.xlsx',
      pageNumber: 2,
      sectionNumber: 'Schedule B',
      clauseTitle: 'Item 2.05 - Active Optical Cabling',
      exactSnippet: "Item 2.05: 100G QSFP28 Active Optical Cables (3m & 5m). Newly inserted line item. Qty: 32 Nos."
    },
    affectedDocuments: ['Revised_Financial_BOQ_v2.xlsx'],
    relevantRoles: ['FINANCE', 'TECHNICAL'],
    verificationStatus: 'CONFIRMED'
  },
  {
    id: 'chg-010',
    tenderId: 'tender-demo-001',
    category: 'COMMERCIAL',
    changeType: 'MODIFIED',
    materiality: 'LOW',
    confidence: 'HIGH',
    confidenceReason: 'Corrigendum 2 Clause C2.4 modifies tender fee payment method.',
    title: 'Tender Processing Fee Transitioned Exclusively to CPPP Gateway',
    requirementKey: 'TENDER_FEE_PORTAL_PAYMENT',
    originalText: 'Payment via DD or RTGS to Institute bank account with counterfoil upload.',
    updatedText: 'Payment of Tender Processing Fee of INR 5,000/- must now be executed strictly through CPPP e-payment gateway. Offline DD/RTGS slips will no longer be accepted.',
    beforeValue: 'Offline DD / RTGS Slip',
    afterValue: 'CPPP Integrated Gateway',
    impactExplanation: 'Online payment receipt automatically generated by portal must be mapped during final bid packet assembly.',
    actionRequired: 'Authorize bid submission team credit/debit/net-banking access for portal checkout.',
    sourceCitation: {
      documentId: 'doc-corr-02',
      documentName: 'Corrigendum_2_Substantive_Amendments.pdf',
      pageNumber: 4,
      sectionNumber: 'Clause C2.4',
      clauseTitle: 'Portal Payment Gateway for Tender Processing Fee',
      exactSnippet: "Payment of Tender Processing Fee of INR 5,000/- must now be executed strictly through CPPP e-payment gateway."
    },
    affectedDocuments: ['NIT_089_T04_Original_Tender.pdf', 'Corrigendum_2_Substantive_Amendments.pdf'],
    relevantRoles: ['FINANCE', 'OPERATIONS'],
    verificationStatus: 'CONFIRMED'
  },
  {
    id: 'chg-011',
    tenderId: 'tender-demo-001',
    category: 'SUBMISSION',
    changeType: 'CLARIFICATION',
    materiality: 'LOW',
    confidence: 'HIGH',
    confidenceReason: 'Corrigendum 1 Clause C1.2 clarifies pre-bid hybrid mode.',
    title: 'Pre-Bid Conference Held in Hybrid Mode (Webex & In-Person)',
    requirementKey: 'PRE_BID_MODE',
    originalText: 'Physical attendance mandatory at Senate Hall, IISEAR Campus.',
    updatedText: 'Pre-bid meeting conducted in HYBRID mode (Physical + Virtual Webex link).',
    beforeValue: 'Physical Only',
    afterValue: 'Hybrid (Physical + Virtual)',
    impactExplanation: 'Informational. Pre-bid completed successfully on 05-Aug-2026.',
    actionRequired: 'Record kept in audit docket.',
    sourceCitation: {
      documentId: 'doc-corr-01',
      documentName: 'Corrigendum_1_Extension_and_EMD.pdf',
      pageNumber: 2,
      sectionNumber: 'Clause C1.2',
      clauseTitle: 'Pre-Bid Meeting Mode',
      exactSnippet: "The Pre-bid meeting scheduled for 05-Aug-2026 will now be conducted in HYBRID mode..."
    },
    affectedDocuments: ['Corrigendum_1_Extension_and_EMD.pdf'],
    relevantRoles: ['BID_MANAGER'],
    verificationStatus: 'CONFIRMED'
  },
  {
    id: 'chg-012',
    tenderId: 'tender-demo-001',
    category: 'DOCUMENTATION',
    changeType: 'NO_MATERIAL_CHANGE',
    materiality: 'INFORMATIONAL',
    confidence: 'HIGH',
    confidenceReason: 'Minor clause numbering correction across Technical Volume Index.',
    title: 'Section Indexing and Typography Standardization',
    requirementKey: 'SECTION_TYPO_NUMBERING',
    originalText: 'Section 6.1 listed sub-clauses out of sequential order in original document index table.',
    updatedText: 'Corrigendum 2 Appendix re-sequences section index numbers 6.1.1 through 6.1.9.',
    beforeValue: 'Sub-clause index misaligned',
    afterValue: 'Standardized Section 6.1.1-6.1.9',
    impactExplanation: 'Pure formatting correction. No legal or commercial impact.',
    actionRequired: 'Cross-reference final technical proposal table of contents with standardized numbers.',
    sourceCitation: {
      documentId: 'doc-corr-02',
      documentName: 'Corrigendum_2_Substantive_Amendments.pdf',
      pageNumber: 5,
      sectionNumber: 'Appendix 1',
      clauseTitle: 'Standardized Technical Index',
      exactSnippet: "Appendix 1: Re-sequencing of Technical Specifications index numbering 6.1.1 through 6.1.9 for administrative consistency."
    },
    affectedDocuments: ['Corrigendum_2_Substantive_Amendments.pdf'],
    relevantRoles: ['BID_MANAGER'],
    verificationStatus: 'CONFIRMED'
  }
];

export const DEMO_REQUIREMENTS: StructuredRequirement[] = [
  {
    id: 'req-01',
    tenderId: 'tender-demo-001',
    key: 'FINANCIAL_TURNOVER_THRESHOLD',
    category: 'TURNOVER',
    title: 'Average Annual Financial Turnover (Last 3 FYs)',
    originalValue: '₹10.00 Crore',
    currentValue: '₹15.00 Crore',
    hasChanged: true,
    mandatory: true,
    sourceDocumentId: 'doc-corr-02',
    sourceCitation: {
      documentId: 'doc-corr-02',
      documentName: 'Corrigendum_2_Substantive_Amendments.pdf',
      pageNumber: 2,
      sectionNumber: 'Clause C2.2',
      exactSnippet: "Average Annual Financial Turnover of at least INR 15.00 Crores..."
    },
    verificationStatus: 'CONFIRMED',
    ownerRole: 'FINANCE',
    evidenceRequired: 'Audited balance sheets (FY 2022-23, 23-24, 24-25) + CA Certificate with valid UDIN',
    evidenceProvided: 'CA Certificate Ref: CA/2026/089-T04 with UDIN 26049281BGHK910 (Turnover ₹18.4 Cr)',
    evidenceStatus: 'VERIFIED',
    riskLevel: 'HIGH',
    status: 'COMPLIANT'
  },
  {
    id: 'req-02',
    tenderId: 'tender-demo-001',
    key: 'SUBMISSION_DEADLINE',
    category: 'SUBMISSION',
    title: 'Electronic Bid Submission End Date & Time',
    originalValue: '12-Aug-2026 15:00 hrs',
    currentValue: '19-Aug-2026 15:00 hrs',
    hasChanged: true,
    mandatory: true,
    sourceDocumentId: 'doc-corr-02',
    sourceCitation: {
      documentId: 'doc-corr-02',
      documentName: 'Corrigendum_2_Substantive_Amendments.pdf',
      pageNumber: 1,
      sectionNumber: 'Clause C2.1',
      exactSnippet: "Bid Submission End Date is hereby EXTENDED to 19-Aug-2026..."
    },
    verificationStatus: 'CONFIRMED',
    ownerRole: 'BID_MANAGER',
    evidenceRequired: 'CPPP Portal submission confirmation slip / timestamped bid token',
    evidenceProvided: 'Draft packet prepared for upload on 18-Aug-2026',
    evidenceStatus: 'PENDING',
    riskLevel: 'CRITICAL',
    status: 'ACTION_REQUIRED'
  },
  {
    id: 'req-03',
    tenderId: 'tender-demo-001',
    key: 'EMD_DEPOSIT',
    category: 'EMD',
    title: 'Earnest Money Deposit (EMD) Guarantee',
    originalValue: '₹18.50 Lakhs (Ambiguous ₹20L in Annexure)',
    currentValue: '₹18.50 Lakhs (Or Valid UDYAM MSE Certificate)',
    hasChanged: true,
    mandatory: true,
    sourceDocumentId: 'doc-corr-01',
    sourceCitation: {
      documentId: 'doc-corr-01',
      documentName: 'Corrigendum_1_Extension_and_EMD.pdf',
      pageNumber: 1,
      sectionNumber: 'Clause C1.1',
      exactSnippet: "applicable Earnest Money Deposit (EMD) is INR 18,50,000/-"
    },
    verificationStatus: 'CONFIRMED',
    ownerRole: 'FINANCE',
    evidenceRequired: 'Bank Guarantee / e-PBG or UDYAM Certificate for IT Hardware Services',
    evidenceProvided: 'UDYAM-MH-12-0049281 attached + Treasury BG draft ready as backup',
    evidenceStatus: 'VERIFIED',
    riskLevel: 'LOW',
    status: 'COMPLIANT'
  },
  {
    id: 'req-04',
    tenderId: 'tender-demo-001',
    key: 'MII_LOCAL_CONTENT',
    category: 'LOCAL_CONTENT',
    title: 'Make in India Class-I Local Content (>= 50%)',
    originalValue: 'Self-declaration',
    currentValue: 'Statutory Auditor Certificate with computation',
    hasChanged: true,
    mandatory: true,
    sourceDocumentId: 'doc-prebid-01',
    sourceCitation: {
      documentId: 'doc-prebid-01',
      documentName: 'Pre_Bid_Clarifications_Reply_Matrix.pdf',
      pageNumber: 11,
      sectionNumber: 'Query #39',
      exactSnippet: "statutory auditor certificate certifying minimum 50% local content"
    },
    verificationStatus: 'CONFIRMED',
    ownerRole: 'LEGAL_COMPLIANCE',
    evidenceRequired: 'Statutory Auditor Certificate with UDIN + OEM Local Content calculation sheet',
    evidenceProvided: 'Draft from Auditor pending OEM local assembly cost breakdown signoff',
    evidenceStatus: 'PENDING',
    riskLevel: 'HIGH',
    status: 'ACTION_REQUIRED'
  },
  {
    id: 'req-05',
    tenderId: 'tender-demo-001',
    key: 'GPU_NODE_RAM',
    category: 'TECHNICAL',
    title: 'GPU Compute Node Memory Spec',
    originalValue: '512 GB DDR5 4800MHz ECC per Node',
    currentValue: '1024 GB (1TB) DDR5 4800MHz ECC per Node',
    hasChanged: true,
    mandatory: true,
    sourceDocumentId: 'doc-boq-02',
    sourceCitation: {
      documentId: 'doc-boq-02',
      documentName: 'Revised_Financial_BOQ_v2.xlsx',
      pageNumber: 1,
      sectionNumber: 'Schedule A',
      exactSnippet: "1024 GB (1TB) DDR5 RAM, 4x NVIDIA H100 80GB SXM5"
    },
    verificationStatus: 'CONFIRMED',
    ownerRole: 'TECHNICAL',
    evidenceRequired: 'OEM Datasheet + Technical Compliance Matrix Cross-Referenced to OEM Specification Sheet',
    evidenceProvided: 'OEM Datasheet Rev 4.2 highlighting 1TB RAM config matched',
    evidenceStatus: 'VERIFIED',
    riskLevel: 'MEDIUM',
    status: 'COMPLIANT'
  },
  {
    id: 'req-06',
    tenderId: 'tender-demo-001',
    key: 'OEM_PRESENCE_INDIA',
    category: 'EXPERIENCE',
    title: 'OEM Operating Presence in India',
    originalValue: '7 Continuous Years',
    currentValue: '5 Continuous Years',
    hasChanged: true,
    mandatory: true,
    sourceDocumentId: 'doc-prebid-01',
    sourceCitation: {
      documentId: 'doc-prebid-01',
      documentName: 'Pre_Bid_Clarifications_Reply_Matrix.pdf',
      pageNumber: 6,
      sectionNumber: 'Query #22',
      exactSnippet: "relaxed from 7 years to 5 (five) continuous years"
    },
    verificationStatus: 'CONFIRMED',
    ownerRole: 'LEGAL_COMPLIANCE',
    evidenceRequired: 'OEM Certificate of Incorporation in India (MCA / RoC)',
    evidenceProvided: 'OEM RoC Certificate dated 14-Jan-2020 (>6 years)',
    evidenceStatus: 'VERIFIED',
    riskLevel: 'LOW',
    status: 'COMPLIANT'
  },
  {
    id: 'req-07',
    tenderId: 'tender-demo-001',
    key: 'WARRANTY_SUPPORT_SLA',
    category: 'WARRANTY',
    title: 'On-Site Warranty & SLA Response Time',
    originalValue: '3 Years Comprehensive NBD Response',
    currentValue: '3 Years with 4-Hour On-Site Response + Spares in MH',
    hasChanged: true,
    mandatory: true,
    sourceDocumentId: 'doc-corr-02',
    sourceCitation: {
      documentId: 'doc-corr-02',
      documentName: 'Corrigendum_2_Substantive_Amendments.pdf',
      pageNumber: 3,
      sectionNumber: 'Clause C2.3',
      exactSnippet: "guaranteed 4-hour on-site engineer response time"
    },
    verificationStatus: 'CONFIRMED',
    ownerRole: 'OPERATIONS',
    evidenceRequired: 'Back-to-Back OEM SLA letter signed by authorized signatory',
    evidenceProvided: 'Signed MAF with 4-hour SLA clause received from OEM Regional VP',
    evidenceStatus: 'VERIFIED',
    riskLevel: 'MEDIUM',
    status: 'COMPLIANT'
  },
  {
    id: 'req-08',
    tenderId: 'tender-demo-001',
    key: 'PERFORMANCE_SECURITY_PBG',
    category: 'PERFORMANCE_SECURITY',
    title: 'Performance Security Bank Guarantee (PBG)',
    originalValue: '5% of Total Contract Value',
    currentValue: '5% of Total Contract Value (Unchanged)',
    hasChanged: false,
    mandatory: true,
    sourceDocumentId: 'doc-nit-01',
    sourceCitation: {
      documentId: 'doc-nit-01',
      documentName: 'NIT_089_T04_Original_Tender.pdf',
      pageNumber: 18,
      sectionNumber: 'Clause 4.8',
      exactSnippet: "Performance Security of 5% within 14 days of LoA"
    },
    verificationStatus: 'CONFIRMED',
    ownerRole: 'FINANCE',
    evidenceRequired: 'Undertaking to furnish PBG within 14 days of Award',
    evidenceProvided: 'Form D undertaking signed in Technical Envelope',
    evidenceStatus: 'VERIFIED',
    riskLevel: 'LOW',
    status: 'COMPLIANT'
  }
];

export const DEMO_BOQ_CHANGES: BOQItemChange[] = [
  {
    id: 'boq-chg-1',
    itemNumber: '1.01',
    description: 'GPU AI Compute Nodes (Dual AMD EPYC 9654, 4x NVIDIA H100 80GB SXM5)',
    originalQuantity: 8,
    revisedQuantity: 8,
    unit: 'Sets',
    originalSpec: '512 GB DDR5 RAM per node',
    revisedSpec: '1024 GB (1TB) DDR5 RAM per node',
    percentageChange: 0,
    changeType: 'SPEC_MODIFIED',
    pricingImpactNotes: 'Memory doubled across 8 nodes (+4TB DDR5). Est. cost impact +₹18.4 Lakhs total BOM.',
    sourceCitation: {
      documentId: 'doc-boq-02',
      documentName: 'Revised_Financial_BOQ_v2.xlsx',
      pageNumber: 1,
      sectionNumber: 'Schedule A Item 1.01',
      exactSnippet: "Item 1.01: 8 Nodes AI GPU Compute Server with Dual AMD EPYC 9654, 1024 GB (1TB) DDR5 RAM..."
    }
  },
  {
    id: 'boq-chg-2',
    itemNumber: '2.03',
    description: 'Managed 32-Port 100Gbps HDR InfiniBand Switches',
    originalQuantity: 2,
    revisedQuantity: 4,
    unit: 'Units',
    originalSpec: '2 Switches with standard uplinks',
    revisedSpec: '4 Switches for 2:1 non-blocking spine-leaf fabric',
    percentageChange: 100,
    changeType: 'QTY_INCREASED',
    pricingImpactNotes: 'Quantity increased from 2 to 4 (+100%). Est. cost impact +₹14.2 Lakhs.',
    sourceCitation: {
      documentId: 'doc-boq-02',
      documentName: 'Revised_Financial_BOQ_v2.xlsx',
      pageNumber: 2,
      sectionNumber: 'Schedule B Item 2.03',
      exactSnippet: "Quantity revised from 2 Units to 4 Units to support non-blocking spine-leaf..."
    }
  },
  {
    id: 'boq-chg-3',
    itemNumber: '2.05',
    description: '100G QSFP28 Active Optical Cables (3m & 5m length)',
    originalQuantity: 0,
    revisedQuantity: 32,
    unit: 'Nos',
    originalSpec: 'Not listed in original BOQ table',
    revisedSpec: '32 Nos 100G QSFP28 AOC cables for spine-leaf interconnect',
    percentageChange: 100,
    changeType: 'NEW_ITEM',
    pricingImpactNotes: 'Newly added line item. Failure to enter unit rate in electronic BOQ will invalidate bid. Est. cost +₹4.8 Lakhs.',
    sourceCitation: {
      documentId: 'doc-boq-02',
      documentName: 'Revised_Financial_BOQ_v2.xlsx',
      pageNumber: 2,
      sectionNumber: 'Schedule B Item 2.05',
      exactSnippet: "Item 2.05: 100G QSFP28 Active Optical Cables (3m & 5m). Newly inserted line item. Qty: 32 Nos."
    }
  },
  {
    id: 'boq-chg-4',
    itemNumber: '3.01',
    description: 'Liquid Cooling Rack Distribution Units & Manifolds',
    originalQuantity: 2,
    revisedQuantity: 2,
    unit: 'Sets',
    originalSpec: 'Closed-loop CDU with 40kW heat rejection',
    revisedSpec: 'Closed-loop CDU with 40kW heat rejection (Unchanged)',
    percentageChange: 0,
    changeType: 'UNCHANGED',
    pricingImpactNotes: 'No change in quantity or specifications.',
    sourceCitation: {
      documentId: 'doc-boq-02',
      documentName: 'Revised_Financial_BOQ_v2.xlsx',
      pageNumber: 3,
      sectionNumber: 'Schedule C Item 3.01',
      exactSnippet: "Item 3.01: Closed-loop CDU with 40kW heat rejection. Qty: 2 Sets."
    }
  }
];

export const DEMO_CONFLICTS: ConflictRecord[] = [
  {
    id: 'conf-001',
    tenderId: 'tender-demo-001',
    title: 'Discrepancy in EMD Deposit Amount (NIT Section 4.2 vs Annexure VII)',
    category: 'EMD',
    severity: 'MEDIUM',
    statementA: {
      documentName: 'NIT_089_T04_Original_Tender.pdf',
      pageNumber: 14,
      clause: 'Section 4.2',
      text: "The bidder shall furnish an EMD of INR 18,50,000/- (Rupees Eighteen Lakh Fifty Thousand only)..."
    },
    statementB: {
      documentName: 'NIT_089_T04_Original_Tender.pdf',
      pageNumber: 64,
      clause: 'Annexure VII Form C',
      text: "The bidder shall deposit an Earnest Money Deposit (EMD) of INR 20,00,000/- (Rupees Twenty Lakhs only)..."
    },
    conflictDescription: 'NIT main clause specified ₹18.50 Lakhs whereas Annexure checklist prescribed ₹20.00 Lakhs. Corrigendum 1 subsequently superseded the Annexure and confirmed ₹18.50 Lakhs.',
    suggestedClarificationQuery: 'Confirmed via Corrigendum 1 Clause C1.1: EMD is ₹18,50,000/-. Follow Corrigendum 1 for Bank Guarantee value.',
    status: 'RESOLVED_BY_CORRIGENDUM'
  },
  {
    id: 'conf-002',
    tenderId: 'tender-demo-001',
    title: 'Potential Ambiguity in Local Content Threshold for Imported GPU Accelerator Cards',
    category: 'LOCAL_CONTENT',
    severity: 'HIGH',
    statementA: {
      documentName: 'Pre_Bid_Clarifications_Reply_Matrix.pdf',
      pageNumber: 11,
      clause: 'Query #39 Reply',
      text: "bidders must submit a statutory auditor certificate certifying minimum 50% local content with detailed computation breakdown."
    },
    statementB: {
      documentName: 'NIT_089_T04_Original_Tender.pdf',
      pageNumber: 28,
      clause: 'Section 5.9 (MII Exemption for Specialized Silicon)',
      text: "Non-substitutable GPU accelerator ASICs and HBM3 memory packages shall be accounted under exempted imported items as per MeitY Notification No. W-43/4/2021-IPHW."
    },
    conflictDescription: 'Query #39 reply strictly enforces 50% overall local content without reiterating the MeitY silicon exemption clause. Auditor must specify local value addition in server chassis assembly, integration, testing, and indigenous software stack.',
    suggestedClarificationQuery: 'Ensure Statutory Auditor explicitly calculates local content percentage over total server BoM net of exempted MeitY semiconductor modules.',
    status: 'OPEN'
  }
];

export const DEMO_DEADLINES: TenderDeadline[] = [
  {
    id: 'dl-1',
    milestone: 'Tender Publication Date',
    originalDate: '2026-07-28 17:00 IST',
    currentDate: '2026-07-28 17:00 IST',
    dateShiftDays: 0,
    isExtended: false,
    sourceDocumentName: 'NIT_089_T04_Original_Tender.pdf',
    sourceCitation: {
      documentId: 'doc-nit-01',
      documentName: 'NIT_089_T04_Original_Tender.pdf',
      pageNumber: 3,
      exactSnippet: "Tender Published: 28-Jul-2026"
    },
    timeRemainingDays: 0
  },
  {
    id: 'dl-2',
    milestone: 'Pre-Bid Meeting & Clarifications Cutoff',
    originalDate: '2026-08-05 11:00 IST',
    currentDate: '2026-08-05 11:00 IST (Hybrid)',
    dateShiftDays: 0,
    isExtended: false,
    sourceDocumentName: 'Corrigendum_1_Extension_and_EMD.pdf',
    sourceCitation: {
      documentId: 'doc-corr-01',
      documentName: 'Corrigendum_1_Extension_and_EMD.pdf',
      pageNumber: 2,
      exactSnippet: "Pre-bid meeting conducted in HYBRID mode on 05-Aug-2026"
    },
    timeRemainingDays: 0
  },
  {
    id: 'dl-3',
    milestone: 'Bid Submission Closing Deadline',
    originalDate: '2026-08-12 15:00 IST',
    currentDate: '2026-08-19 15:00 IST',
    dateShiftDays: 7,
    isExtended: true,
    sourceDocumentName: 'Corrigendum_2_Substantive_Amendments.pdf',
    sourceCitation: {
      documentId: 'doc-corr-02',
      documentName: 'Corrigendum_2_Substantive_Amendments.pdf',
      pageNumber: 1,
      exactSnippet: "Bid Submission End Date is hereby EXTENDED to 19-Aug-2026 (15:00 hrs IST)"
    },
    timeRemainingDays: 1
  },
  {
    id: 'dl-4',
    milestone: 'Technical Bid Electronic Opening',
    originalDate: '2026-08-13 15:30 IST',
    currentDate: '2026-08-20 15:30 IST',
    dateShiftDays: 7,
    isExtended: true,
    sourceDocumentName: 'Corrigendum_2_Substantive_Amendments.pdf',
    sourceCitation: {
      documentId: 'doc-corr-02',
      documentName: 'Corrigendum_2_Substantive_Amendments.pdf',
      pageNumber: 1,
      exactSnippet: "Technical bid opening will be on 20-Aug-2026 at 15:30 hrs IST."
    },
    timeRemainingDays: 2
  }
];

export const DEMO_TASKS: ActionTask[] = [
  {
    id: 'task-01',
    tenderId: 'tender-demo-001',
    changeId: 'chg-001',
    title: 'Obtain Revised CA Turnover Certificate (Min ₹15 Cr with UDIN)',
    description: 'Corrigendum 2 increased turnover criteria from ₹10 Cr to ₹15 Cr. Obtain updated UDIN certificate from practicing Chartered Accountant.',
    category: 'TURNOVER',
    ownerRole: 'FINANCE',
    assigneeName: 'Finance reviewer',
    dueDate: '2026-08-16',
    priority: 'CRITICAL',
    status: 'COMPLETED',
    sourceCitation: {
      documentId: 'doc-corr-02',
      documentName: 'Corrigendum_2_Substantive_Amendments.pdf',
      pageNumber: 2,
      sectionNumber: 'Clause C2.2',
      exactSnippet: "Average Annual Financial Turnover of at least INR 15.00 Crores..."
    },
    isAiGenerated: true,
    confirmedByHuman: true,
    completedAt: '2026-08-11',
    notes: 'Received CA Certificate UDIN 26049281BGHK910 certifying ₹18.4 Cr average turnover.'
  },
  {
    id: 'task-02',
    tenderId: 'tender-demo-001',
    changeId: 'chg-004',
    title: 'Execute Statutory Auditor Class-I Local Content (>= 50%) Certificate',
    description: 'Pre-Bid query #39 response mandates statutory auditor signoff for Make in India Class-I supplier compliance with calculation sheet.',
    category: 'LOCAL_CONTENT',
    ownerRole: 'LEGAL_COMPLIANCE',
    assigneeName: 'Adv. S. Kulkarni (Compliance)',
    dueDate: '2026-08-17',
    priority: 'HIGH',
    status: 'OPEN',
    sourceCitation: {
      documentId: 'doc-prebid-01',
      documentName: 'Pre_Bid_Clarifications_Reply_Matrix.pdf',
      pageNumber: 11,
      sectionNumber: 'Query #39',
      exactSnippet: "statutory auditor certificate certifying minimum 50% local content"
    },
    isAiGenerated: true,
    confirmedByHuman: true,
    notes: 'Auditor draft in progress; awaiting final OEM chassis BOM breakdown.'
  },
  {
    id: 'task-03',
    tenderId: 'tender-demo-001',
    changeId: 'chg-003',
    title: 'Recalculate BOQ Pricing with 1024GB RAM & 4x InfiniBand Switches',
    description: 'Pre-bid and Revised BOQ doubled server RAM (512GB -> 1TB) and doubled IB switches (2 -> 4). Update commercial model before CPPP upload.',
    category: 'TECHNICAL',
    ownerRole: 'TECHNICAL',
    assigneeName: 'V. Iyer (Solutions Architect)',
    dueDate: '2026-08-17',
    priority: 'CRITICAL',
    status: 'IN_PROGRESS',
    sourceCitation: {
      documentId: 'doc-boq-02',
      documentName: 'Revised_Financial_BOQ_v2.xlsx',
      pageNumber: 1,
      sectionNumber: 'Schedule A & B',
      exactSnippet: "Item 1.01: 1024 GB (1TB) DDR5 RAM & Item 2.03: 4 Units Switches"
    },
    isAiGenerated: true,
    confirmedByHuman: true,
    notes: 'OEM revised quote received at ₹8.82 Cr. Commercial margin being finalized.'
  },
  {
    id: 'task-04',
    tenderId: 'tender-demo-001',
    changeId: 'chg-008',
    title: 'Collect Back-to-Back OEM 4-Hour On-Site SLA Authorization Form',
    description: 'Corrigendum 2 added specific requirement for 4-hour on-site SLA commitment letter with Pune/Mumbai spares depot details.',
    category: 'WARRANTY',
    ownerRole: 'OPERATIONS',
    assigneeName: 'K. Patel (Operations Manager)',
    dueDate: '2026-08-16',
    priority: 'MEDIUM',
    status: 'COMPLETED',
    sourceCitation: {
      documentId: 'doc-corr-02',
      documentName: 'Corrigendum_2_Substantive_Amendments.pdf',
      pageNumber: 3,
      sectionNumber: 'Clause C2.3',
      exactSnippet: "guaranteed 4-hour on-site engineer response time"
    },
    isAiGenerated: true,
    confirmedByHuman: true,
    completedAt: '2026-08-12',
    notes: 'MAF received with exact 4-hour SLA language from OEM Director.'
  },
  {
    id: 'task-05',
    tenderId: 'tender-demo-001',
    changeId: 'chg-009',
    title: 'Populate Unit Rates for Item 2.05 (32x 100G AOC Cables) in BOQ',
    description: 'Ensure new line item Item 2.05 is not left empty in the downloaded CPPP financial BOQ Excel file.',
    category: 'FINANCIAL',
    ownerRole: 'FINANCE',
    assigneeName: 'Finance reviewer',
    dueDate: '2026-08-18',
    priority: 'HIGH',
    status: 'OPEN',
    sourceCitation: {
      documentId: 'doc-boq-02',
      documentName: 'Revised_Financial_BOQ_v2.xlsx',
      pageNumber: 2,
      sectionNumber: 'Schedule B Item 2.05',
      exactSnippet: "Item 2.05: 100G QSFP28 Active Optical Cables (3m & 5m). Newly inserted line item."
    },
    isAiGenerated: true,
    confirmedByHuman: true
  }
];

export const DEMO_AUDIT_TRAIL = [
  {
    id: 'audit-001',
    tenderId: 'tender-demo-001',
    timestamp: '2026-07-28T10:15:00Z',
    action: 'INGESTED_BASELINE_DOCUMENTS',
    user: 'Bid management reviewer',
    role: 'BID_MANAGER',
    details: 'Ingested baseline NIT_089_T04_Original_Tender.pdf (68 pages, 4.28 MB) as Version 1.0 baseline.',
    category: 'INGESTION' as const
  },
  {
    id: 'audit-002',
    tenderId: 'tender-demo-001',
    timestamp: '2026-08-03T11:45:00Z',
    action: 'INGESTED_CORRIGENDUM_1',
    user: 'Bid management reviewer',
    role: 'BID_MANAGER',
    details: 'Ingested Corrigendum_1_Extension_and_EMD.pdf. Detected EMD typo rectification (₹18.50L confirmed).',
    category: 'INGESTION' as const
  },
  {
    id: 'audit-003',
    tenderId: 'tender-demo-001',
    timestamp: '2026-08-07T16:20:00Z',
    action: 'INGESTED_PREBID_CLARIFICATIONS',
    user: 'Technical reviewer',
    role: 'TECHNICAL',
    details: 'Ingested Pre_Bid_Clarifications_Reply_Matrix.pdf (54 queries). Detected RAM revision to 1TB & MII auditor certificate requirement.',
    category: 'INGESTION' as const
  },
  {
    id: 'audit-004',
    tenderId: 'tender-demo-001',
    timestamp: '2026-08-09T14:10:00Z',
    action: 'INGESTED_CORRIGENDUM_2_AND_BOQ',
    user: 'Bid management reviewer',
    role: 'BID_MANAGER',
    details: 'Ingested Corrigendum_2_Substantive_Amendments.pdf & Revised_Financial_BOQ_v2.xlsx. Triggered Version Intelligence Delta Analysis.',
    category: 'INGESTION' as const
  },
  {
    id: 'audit-005',
    tenderId: 'tender-demo-001',
    timestamp: '2026-08-10T09:30:00Z',
    action: 'VERIFIED_CRITICAL_TURNOVER_CHANGE',
    user: 'Finance reviewer',
    role: 'FINANCE',
    details: 'Confirmed turnover threshold increase to ₹15 Cr. Assigned fresh CA certificate task with UDIN.',
    category: 'VERIFICATION' as const
  }
];

export const DEMO_TENDER: Tender = {
  id: 'tender-demo-001',
  title: 'Supply, Installation, Testing & Commissioning of High-Performance AI & Research Computing Infrastructure',
  referenceNumber: 'IISEAR/PROC/CC/2026/089-T04',
  organization: 'Indian Institute of Science Education & Advanced Research (IISEAR)',
  organizationType: 'CENTRAL_INSTITUTE',
  portal: 'CPPP',
  estimatedValueInr: 92500000,
  currency: 'INR',
  publishDate: '2026-07-28',
  originalSubmissionDeadline: '2026-08-12T15:00:00+05:30',
  currentSubmissionDeadline: '2026-08-19T15:00:00+05:30',
  preBidMeetingDate: '2026-08-05T11:00:00+05:30',
  technicalBidOpeningDate: '2026-08-20T15:30:00+05:30',
  currentVersion: 'Version 5.0 (Revised BOQ + Corrigendum 2)',
  riskScore: 'HIGH',
  riskScoreReason: 'Turnover increased to ₹15 Cr (+50%), submission deadline extended by 7 days, BOQ specs doubled (RAM & Switches), mandatory statutory auditor Class-I local content certificate required.',
  documents: DEMO_DOCUMENTS,
  changes: DEMO_CHANGES,
  requirements: DEMO_REQUIREMENTS,
  boqChanges: DEMO_BOQ_CHANGES,
  conflicts: DEMO_CONFLICTS,
  deadlines: DEMO_DEADLINES,
  tasks: DEMO_TASKS,
  auditTrail: DEMO_AUDIT_TRAIL,
  provenance: 'SYNTHETIC_DEMO',
  notes: 'High-priority institutional procurement for National Supercomputing & AI Initiative node.',
  createdAt: '2026-07-28T10:00:00Z',
  updatedAt: '2026-08-10T14:30:00Z'
};

export const SECONDARY_SAMPLE_TENDERS: Tender[] = [
  {
    id: 'tender-ntpc-002',
    title: 'Design, Engineering, Supply and Erection of 100MW Solar Photovoltaic Grid-Connected Project',
    referenceNumber: 'NTPC/RE/SOLAR/2026/041-PKG2',
    organization: 'NTPC Renewable Energy Limited (PSU)',
    organizationType: 'PSU',
    portal: 'GeM',
    estimatedValueInr: 440000000,
    currency: 'INR',
    publishDate: '2026-08-01',
    originalSubmissionDeadline: '2026-08-25T14:00:00+05:30',
    currentSubmissionDeadline: '2026-09-02T14:00:00+05:30',
    preBidMeetingDate: '2026-08-10T11:00:00+05:30',
    technicalBidOpeningDate: '2026-09-03T15:00:00+05:30',
    currentVersion: 'Version 3.0 (Corrigendum 1 + ALMM Update)',
    riskScore: 'CRITICAL',
    riskScoreReason: 'Mandatory ALMM List-I ALMM compliance clause amended, BNEF Tier-1 module threshold updated, submission extended by 8 days.',
    documents: [],
    changes: [],
    requirements: [],
    boqChanges: [],
    conflicts: [],
    deadlines: [],
    tasks: [],
    auditTrail: [],
    provenance: 'SYNTHETIC_DEMO',
    createdAt: '2026-08-01T09:00:00Z',
    updatedAt: '2026-08-12T16:00:00Z'
  },
  {
    id: 'tender-iocl-003',
    title: 'Annual Maintenance & Comprehensive Engineering Support for Distributed Control Systems (DCS)',
    referenceNumber: 'IOCL/RH/INSTR/2026/1109',
    organization: 'Indian Oil Corporation Ltd - Refineries Division',
    organizationType: 'PSU',
    portal: 'CPPP',
    estimatedValueInr: 32000000,
    currency: 'INR',
    publishDate: '2026-08-04',
    originalSubmissionDeadline: '2026-08-28T15:00:00+05:30',
    currentSubmissionDeadline: '2026-08-28T15:00:00+05:30',
    currentVersion: 'Version 1.0 (Original NIT)',
    riskScore: 'LOW',
    riskScoreReason: 'Standard GCC/SCC terms, no corrigenda issued yet. Pre-bid meeting pending.',
    documents: [],
    changes: [],
    requirements: [],
    boqChanges: [],
    conflicts: [],
    deadlines: [],
    tasks: [],
    auditTrail: [],
    provenance: 'SYNTHETIC_DEMO',
    createdAt: '2026-08-04T11:00:00Z',
    updatedAt: '2026-08-04T11:00:00Z'
  }
];
