import { LearningPage } from "@/components/learning/learning-page"
import type { Track } from "@/components/learning/types"

const track: Track = {
  id: "insurance",
  title: "Insurance Essentials",
  lessons: [
    {
      id: "ins-01",
      title: "Insurance for Beginners - The Complete Guide",
      type: "text",
      level: "beginner",
      content: `Insurance for beginners! Let's start with the basics.

What is Insurance?
Insurance is a financial product that helps protect you against unforeseen events, such as accidents, illnesses, or natural disasters. By paying a premium, you transfer the risk to the insurance company, which provides financial compensation if the event occurs.

Types of Insurance
- Life Insurance: Provides a payout to your beneficiaries in the event of your death.
- Health Insurance: Covers medical expenses for illnesses, injuries, or surgeries.
- Property Insurance: Protects your assets, such as your home or car, against damage or loss.
- Liability Insurance: Protects you against financial losses if you're held responsible for someone else's injuries or property damage.

Key Insurance Terms
- Premium: The amount you pay for insurance coverage.
- Policy: The contract between you and the insurance company.
- Deductible: The amount you pay out-of-pocket before the insurance coverage kicks in.
- Claim: A request for financial compensation when an insured event occurs.

Benefits of Insurance
- Financial Protection: Insurance helps protect your finances against unforeseen events.
- Peace of Mind: Knowing you're protected can give you peace of mind and reduce stress.
- Risk Management: Insurance helps you manage risk by transferring it to the insurance company.

How to Choose an Insurance Policy
- Assess Your Needs: Determine what type of insurance you need and how much coverage you require.
- Compare Policies: Research and compare different insurance policies to find the best fit for you.
- Read the Fine Print: Understand the terms and conditions of the policy, including any exclusions or limitations.
- Work with a Reputable Insurer: Choose an insurance company with a good reputation and strong financials.

Tips for Beginners
- Start with the Basics: Begin with essential insurance coverage, such as health or life insurance.
- Understand Your Policy: Take the time to read and understand your policy documents.
- Ask Questions: Don't hesitate to ask questions or seek clarification from your insurance provider.
- Review and Update: Regularly review your insurance coverage and update your policies as needed.

I hope this helps you get started with insurance!`,
    },
    {
      id: "ins-02",
      title: "Insurance Basics Explained - Video Guide",
      type: "video",
      level: "beginner",
      link: "https://www.youtube.com/embed/75NOoijgjZE?si=P5fmRL3cod0ybHP6",
    },
    {
      id: "ins-04",
      title: "Intermediate Insurance Concepts",
      type: "text",
      level: "intermediate",
      content: `As an intermediate learner, understanding insurance basics and beyond is crucial. Here's what you need to know:

Types of Insurance
- Life Insurance: Provides a payout to beneficiaries in case of death or terminal illness
- Health Insurance: Covers medical expenses for illnesses, injuries, or surgeries
- Property Insurance: Protects assets like homes or cars against damage or loss
- Marine Insurance: Covers goods in transit against damage or loss, including intermediate storage

Key Concepts
- Premium: The amount paid for insurance coverage
- Policy: The contract between the insured and the insurance company
- Deductible: The amount paid out-of-pocket before insurance coverage kicks in
- Claim: A request for financial compensation when an insured event occurs

Intermediate Storage in Marine Insurance
- Definition: Temporary storage of goods during transit, often due to customs clearance, congestion, or vessel diversion
- Importance: Protects goods from damage or loss during storage, reducing financial losses
- Coverage: Includes warehousing, inland transit, loading/unloading, and customs duty coverage

Insurance Coverage and Exclusions
- Inclusions: Damage or loss due to theft, fire, pilferage, or spoilage
- Exclusions: War, strikes, nuclear risks, inherent vice or nature of goods, insufficient packing, and delay or loss of market

Factors Affecting Insurance Coverage
- Type of Goods: Different goods have varying susceptibility to damage
- Storage Location: Security measures, environmental controls, and location-specific risks
- Duration of Storage: Longer storage periods increase risk
- Packaging: Proper packaging is essential to prevent damage

Benefits of Insurance
- Financial Protection: Insurance protects against unforeseen events and financial losses
- Peace of Mind: Knowing you're protected can reduce stress and anxiety
- Risk Management: Insurance helps manage risk by transferring it to the insurance company

Choosing the Right Insurance Policy
- Assess Your Needs: Determine the type and amount of coverage required
- Compare Policies: Research and compare different insurance policies
- Read the Fine Print: Understand policy terms, conditions, and exclusions
- Work with a Reputable Insurer: Choose an insurance company with a good reputation and strong financials`,
    },
    {
      id: "ins-05",
      title: "Intermediate Insurance Strategies - Video Guide",
      type: "video",
      level: "intermediate",
      link: "https://www.youtube.com/embed/hcMDaMhJanM?si=gDOKZmXJN2QFLgAi",
    },
    {
      id: "ins-08",
      title: "Advanced Insurance Expertise - Comprehensive Guide",
      type: "text",
      level: "advanced",
      content: `As an expert, you should know that insurance is a financial instrument designed to protect individuals and businesses from potential losses. Here's a comprehensive overview:

Types of Insurance- Life Insurance: Provides a payout to beneficiaries in case of death or terminal illness. There are two main categories: term life insurance and permanent life insurance.
    - Term Life Insurance: Provides coverage for a specified period (e.g., 10, 20, or 30 years).
    - Permanent Life Insurance: Provides lifetime coverage and builds cash value over time.
- Health Insurance: Covers medical expenses for illnesses, injuries, or surgeries.
- Property Insurance: Protects assets like homes or cars against damage or loss.
- Liability Insurance: Protects against financial losses if you're held responsible for someone else's injuries or property damage.

Key Concepts- Premium: The amount paid for insurance coverage.
- Policy: The contract between the insured and the insurance company.
- Deductible: The amount paid out-of-pocket before insurance coverage kicks in.
- Claim: A request for financial compensation when an insured event occurs.
- Policy Limit: The maximum amount the insurer will pay out for a covered peril.

Insurance Benefits- Risk Reduction: Insurance protects against unforeseen events, mitigating financial impact.
- Financial Stability: Insurance provides financial stability and security.
- Business Continuity: Insurance compensates businesses for property damage, liability claims, and unforeseen events.
- Peace of Mind: Knowing you're protected can reduce stress and anxiety.

Factors Affecting Insurance Coverage- Type of Goods: Different goods have varying susceptibility to damage.
- Storage Location: Security measures, environmental controls, and location-specific risks.
- Duration of Storage: Longer storage periods increase risk.
- Packaging: Proper packaging is essential to prevent damage.

Tax Benefits- Life Insurance: Premiums are tax-exempt under Section 80C.
- Health Insurance: Premiums are tax-exempt under Section 80D.

Expert Tips- Assess Your Needs: Determine the type and amount of coverage required.
- Compare Policies: Research and compare different insurance policies.
- Read the Fine Print: Understand policy terms, conditions, and exclusions.
- Work with a Reputable Insurer: Choose an insurance company with a good reputation and strong financials.`,
    },
    {
      id: "ins-09",
      title: "Advanced Insurance Strategies - Expert Video",
      type: "video",
      level: "advanced",
      link: "https://www.youtube.com/embed/iAatSAtxmzI?si=PWV-0yeA5LRT1gvS",
    },
  ],
}

export default function Page() {
  return <LearningPage track={track} />
}
