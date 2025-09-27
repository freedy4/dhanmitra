import { LearningPage } from "@/components/learning/learning-page"
import type { Track } from "@/components/learning/types"

const track: Track = {
  id: "taxation",
  title: "Taxation Basics",
  lessons: [
    {
      id: "tax-01",
      title: "Taxation for Beginners - Complete Guide",
      type: "text",
      level: "beginner",
      content: `# Taxation for beginners! Let's start with the basics.

## What is Taxation?
Taxation is the process of collecting revenue by governments from individuals and businesses to fund public goods and services.

## Types of Taxes
- **Direct Taxes**: Taxes levied directly on individuals and businesses, such as income tax.
- **Indirect Taxes**: Taxes levied on goods and services, such as sales tax or value-added tax (VAT).

## Key Concepts
- **Taxable Income**: The amount of income subject to taxation.
- **Tax Rate**: The percentage of taxable income paid in taxes.
- **Tax Deduction**: A reduction in taxable income due to specific expenses or allowances.
- **Tax Exemption**: Income that is not subject to taxation.

## Tax Benefits
- **Reduce Tax Liability**: Claiming tax deductions and exemptions can reduce your tax liability.
- **Increase Savings**: Tax savings can increase your disposable income.

## Tips for Beginners
- **Understand Your Tax Obligations**: Know your tax filing requirements and deadlines.
- **Claim Tax Deductions**: Take advantage of tax deductions and exemptions available to you.
- **Keep Accurate Records**: Maintain records of income, expenses, and tax-related documents.
- **Consult a Tax Professional**: Seek advice from a tax professional if you're unsure about tax matters.

## Common Tax-Related Terms
- **PAN (Permanent Account Number)**: A unique identification number assigned to taxpayers in India.
- **Income Tax Return (ITR)**: A form used to file tax returns with the income tax department.
- **Tax Filing Deadline**: The deadline for filing tax returns, typically July 31st in India.

## Tax Planning Strategies
- **Invest in Tax-Saving Instruments**: Invest in instruments like PPF, NPS, or tax-saving mutual funds to reduce tax liability.
- **Claim Tax Deductions**: Claim deductions for expenses like home loan interest, education loan interest, or charitable donations.
- **Utilize Tax Exemptions**: Utilize tax exemptions available for specific income sources, like agricultural income.

I hope this helps you get started with taxation!`,
    },
    {
      id: "tax-02",
      title: "Taxation Basics - Video Guide",
      type: "video",
      level: "beginner",
      link: "https://www.youtube.com/embed/MQpbxF_RngI?si=0zM_lj73pqUZ6BBh",
    },
    {
      id: "tax-05",
      title: "Intermediate Taxation - Complete Guide",
      type: "text",
      level: "intermediate",
      content: `# Intermediate Taxation - Complete Guide

As an intermediate learner, understanding taxation involves grasping key concepts, laws, and practices. Here's what you should know:

## Taxation Basics
- **Direct Taxes**: Taxes levied directly on individuals and businesses, such as income tax.
- **Indirect Taxes**: Taxes levied on goods and services, like Goods and Services Tax (GST).

## Income Tax
- **Residential Status**: Determines tax liability based on residence.
- **Heads of Income**: Includes:
    - **Salaries**: Tax on income from employment.
    - **House Property**: Tax on income from rental properties.
    - **Business or Profession**: Tax on business income.
    - **Capital Gains**: Tax on gains from asset sales.
    - **Other Sources**: Tax on income from other sources, like interest or dividends.

## Goods and Services Tax (GST)
- **Supply**: GST is levied on the supply of goods and services.
- **Input Tax Credit (ITC)**: Credit for GST paid on inputs.
- **Returns**: Regular filings required under GST.

## Tax Planning Strategies
- **Claim Tax Deductions**: Utilize deductions under Chapter VI-A to reduce taxable income.
- **Invest in Tax-Saving Instruments**: Invest in instruments like PPF, NPS, or tax-saving mutual funds.
- **Understand Tax Laws**: Stay updated on tax laws and amendments.

## CA Intermediate Taxation Exam
- **Exam Pattern**: 30% multiple-choice questions and 70% subjective questions.
- **Syllabus**: Covers income tax laws and GST.
- **Study Materials**: ICAI study materials, practice manuals, and revision test papers are essential resources.

## Preparation Tips
- **Divide the Subject**: Break down the tax subject into smaller parts and allocate time for each.
- **Practice Past Year Papers**: Solve previous year's question papers to understand exam patterns.
- **Stay Updated**: Keep track of amendments and updates in tax laws.`,
    },
    {
      id: "tax-06",
      title: "Intermediate Taxation - Video Guide",
      type: "video",
      level: "intermediate",
      link: "https://www.youtube.com/embed/B85x-3T1BjE?si=TS_TnVYGQNvxRB3w",
    },
    {
      id: "tax-03",
      title: "Expert Taxation Guide - Advanced Concepts",
      type: "text",
      level: "advanced",
      content: `# Expert Taxation Guide - Advanced Concepts

As an expert in taxation, you should know the following key concepts and strategies:

## Taxation Basics
- **Direct Taxes**: Taxes levied directly on individuals and businesses, such as income tax.
- **Indirect Taxes**: Taxes levied on goods and services, like Goods and Services Tax (GST).

## Income Tax
- **Residential Status**: Determines tax liability based on residence.
- **Heads of Income**: Includes:
    - **Salaries**: Tax on income from employment.
    - **House Property**: Tax on income from rental properties.
    - **Business or Profession**: Tax on business income.
    - **Capital Gains**: Tax on gains from asset sales.
    - **Other Sources**: Tax on income from other sources, like interest or dividends.

## Tax Planning Strategies
- **Claim Tax Deductions**: Utilize deductions under Chapter VI-A to reduce taxable income.
- **Invest in Tax-Saving Instruments**: Invest in instruments like PPF, NPS, or tax-saving mutual funds.
- **Understand Tax Laws**: Stay updated on tax laws and amendments.

## GST
- **Supply**: GST is levied on the supply of goods and services.
- **Input Tax Credit (ITC)**: Credit for GST paid on inputs.
- **Returns**: Regular filings required under GST.

## Tax Compliance
- **Tax Audit**: An examination of a taxpayer's accounts to ensure accuracy.
- **Penalties**: Failure to comply with tax laws can result in penalties, such as Section 271(C) for non-disclosure of actual income.

## Tax Rates and Slabs
- **New Tax Regime**: Introduced changes to tax slabs and rates for FY 2025-26, with higher exemption limits and lower tax rates.
- **Old Tax Regime**: Allows deductions for investments, but has higher tax rates.

## Key Documents
- **Form 16**: Certificate issued by employers detailing salary paid and TDS deducted.
- **Form 26AS**: Tax credit statement showing all taxes deducted and deposited.

## Best Practices
- **Stay Informed**: Continuously learn about tax laws and updates.
- **Consult Professionals**: Seek advice from tax professionals for personalized guidance.
- **Maintain Accurate Records**: Keep records of income, expenses, and tax-related documents.`,
    },
    {
      id: "tax-04",
      title: "Advanced Taxation - Expert Video Guide",
      type: "video",
      level: "advanced",
      link: "https://www.youtube.com/embed/AMXGBH7hoJY?si=qIuVqPieT3r4o2G7",
    },
  ],
  quiz: [
    {
      id: "q1",
      question: "A tax credit generally:",
      options: [
        "Reduces your taxable income dollar-for-dollar",
        "Reduces your tax bill dollar-for-dollar",
        "Increases your refund automatically",
        "Is the same as a deduction",
      ],
      correctIndex: 1,
    },
    {
      id: "q2",
      question: "Standard vs. itemized deductions — you usually choose:",
      options: [
        "Whichever yields the higher taxable income",
        "Whichever yields the lower tax",
        "Always itemized",
        "Always standard",
      ],
      correctIndex: 1,
    },
    {
      id: "q3",
      question: "Which is a common filing status?",
      options: ["Employee", "Head of Household", "Manager", "Employer"],
      correctIndex: 1,
    },
  ],
}

export default function Page() {
  return <LearningPage track={track} />
}
