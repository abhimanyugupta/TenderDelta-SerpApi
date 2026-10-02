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
    summary: 'Bid Security should normally be 2% to 5% of the estimated value of the tender. MSEs (Micro & Small Enterprises) and Startups recognized by DPIIT are exempt.',
    sourceAuthority: 'Ministry of Finance, Department of Expenditure (GFR 2017)',
    impactOnTenders: 'Changes in EMD or failure to upload valid UDYAM certificate causes instant non-responsiveness.'
  },
  {
    code: 'GFR Rule 171',
    title: 'Performance Security (PBG)',
    summary: 'Performance Security is required from successful bidder at 3% to 5% (was 3% during COVID, now standard 5%) of contract value, valid for 60 days beyond completion of contractual obligations.',
    sourceAuthority: 'Manual for Procurement of Goods 2024 (DoE / MoF)',
    impactOnTenders: 'Treasury line of credit must be preserved for PBG within 14-21 days of LoA/Award.'
  },
  {
    code: 'PPP-MII Order 2017 (Rev 2020)',
    title: 'Public Procurement (Preference to Make in India)',
    summary: 'Class-I Local Supplier (>=50% local content) gets purchase preference over Class-II (20%-50%). Non-local suppliers (<20%) cannot participate in tenders <₹200 Crore without global tender approval.',
    sourceAuthority: 'DPIIT, Ministry of Commerce & Industry',
    impactOnTenders: 'Requires statutory auditor certificate with valid UDIN for tenders >₹10 Crore.'
  },
  {
    code: 'GFR Rule 144(xi)',
    title: 'Land Border Sharing Countries Restrictions',
    summary: 'Bidders from countries sharing a land border with India must be registered with the Competent Authority (DPIIT Registration Committee).',
    sourceAuthority: 'Department of Expenditure OM F.No.6/18/2019-PPD',
    impactOnTenders: 'Mandatory certificate of compliance required in Technical Volume Envelope.'
  },
  {
    code: 'CVC Guidelines on Corrigenda',
    title: 'Reasonable Time for Submission Post-Corrigendum',
    summary: 'Whenever substantive changes are made through corrigenda, minimum 7 to 15 days of additional submission time must be provided to prospective bidders.',
    sourceAuthority: 'Central Vigilance Commission (CVC Office Order)',
    impactOnTenders: 'Material changes made without corresponding deadline extension are vulnerable to challenge.'
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
