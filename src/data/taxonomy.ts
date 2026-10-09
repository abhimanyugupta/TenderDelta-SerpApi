export interface ProcurementRegulation {
  code: string;
  title: string;
  summary: string;
  sourceAuthority: string;
  impactOnTenders: string;
}

export const INDIAN_PROCUREMENT_RULES: ProcurementRegulation[] = [
  {
    code: 'GFR Rule 170',
    title: 'Earnest Money Deposit (EMD / Bid Security)',
    summary: 'Confirm the applicable bid-security amount, accepted instrument, and exemptions in the current official guidance and the tender clauses.',
    sourceAuthority: 'Ministry of Finance, Department of Expenditure (GFR 2017)',
    impactOnTenders: 'Check the stated amount, permitted instrument, and any exemption against the current tender and applicable official guidance.'
  },
  {
    code: 'GFR Rule 171',
    title: 'Performance Security (PBG)',
    summary: 'Verify the applicable performance-security amount, form, validity, and trigger against current official guidance and the tender.',
    sourceAuthority: 'Manual for Procurement of Goods 2024 (DoE / MoF)',
    impactOnTenders: 'Review the security amount, validity period, and submission deadline in the governing documents.'
  },
  {
    code: 'PPP-MII Order 2017 (Rev 2020)',
    title: 'Public Procurement (Preference to Make in India)',
    summary: 'Local-content preferences, thresholds, certifications, and participation restrictions depend on current orders and tender-specific provisions.',
    sourceAuthority: 'DPIIT, Ministry of Commerce & Industry',
    impactOnTenders: 'Check the applicable order and tender wording; do not infer supplier eligibility from registration alone.'
  },
  {
    code: 'GFR Rule 144(xi)',
    title: 'Land Border Sharing Countries Restrictions',
    summary: 'Restrictions and registration requirements may apply to bidders from countries sharing a land border with India; confirm the current order and tender conditions.',
    sourceAuthority: 'Department of Expenditure OM F.No.6/18/2019-PPD',
    impactOnTenders: 'Verify applicability, competent-authority registration, and required declarations using current official documents.'
  },
  {
    code: 'CVC Guidelines on Corrigenda',
    title: 'Reasonable Time for Submission Post-Corrigendum',
    summary: 'Substantive amendments may require fair notice or an extension; the applicable period depends on current official guidance and the tender circumstances.',
    sourceAuthority: 'Central Vigilance Commission (CVC Office Order)',
    impactOnTenders: 'Check the governing guidance and whether the corrigendum changed the submission deadline; do not assume a universal minimum period.'
  }
];

export const MATERIALITY_DEFINITIONS = {
  CRITICAL: {
    label: 'Critical Materiality',
    badgeClass: 'bg-red-50 text-red-700 border-red-200',
    dotColor: 'bg-red-600',
    description: 'Directly impacts bidder eligibility, disqualification risk, submission deadline, financial qualification, or legal non-responsiveness.'
  },
  HIGH: {
    label: 'High Materiality',
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
    dotColor: 'bg-amber-600',
    description: 'Substantial specification shifts, BOQ items added/removed, EMD value changes, or mandatory statutory certificates.'
  },
  MEDIUM: {
    label: 'Medium Materiality',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
    dotColor: 'bg-blue-600',
    description: 'Warranty SLA adjustments, delivery schedule shifts, payment milestone revisions, or OEM authorization clauses.'
  },
  LOW: {
    label: 'Low Materiality',
    badgeClass: 'bg-stone-50 text-stone-700 border-stone-200',
    dotColor: 'bg-stone-500',
    description: 'Procedural clarifications, meeting modes (virtual/physical), payment gateway changes, or minor packaging conditions.'
  },
  INFORMATIONAL: {
    label: 'Informational',
    badgeClass: 'bg-slate-50 text-slate-600 border-slate-200',
    dotColor: 'bg-slate-400',
    description: 'Typographical corrections, clause renumbering, standard glossary additions without binding legal or commercial effect.'
  }
};
