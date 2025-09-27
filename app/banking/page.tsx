import { LearningPage } from "@/components/learning/learning-page"
import type { Track } from "@/components/learning/types"

const track: Track = {
  id: "banking",
  title: "Banking Fundamentals",
  lessons: [
    {
      id: "bank-00-beginners",
      title: "Banking for Beginners (Read-only)",
      type: "text",
      level: "beginner",
      content: `Banking for beginners! Let's start with the basics.

What is Banking? Banking is a financial service that allows individuals and businesses to manage their money, make transactions, and access various financial products and services.

Types of Banks
- Commercial Banks: Provide basic banking services like checking and savings accounts, loans, and credit cards.
- Retail Banks: Focus on individual customers, offering services like personal loans, mortgages, and credit cards.
- Investment Banks: Specialize in investment services, such as buying and selling securities, and advising on mergers and acquisitions.

Basic Banking Services
- Checking Account: A type of account that allows you to deposit, withdraw, and manage your money for daily transactions.
- Savings Account: A type of account that earns interest on your deposits, helping you save money over time.
- Loans: Banks offer various types of loans, such as personal loans, mortgages, and business loans, to help you achieve your financial goals.
- Credit Cards: Allow you to borrow money from the bank to make purchases, with the option to pay back later.

Banking Terms
- Account Balance: The amount of money in your account.
- Deposit: Putting money into your account.
- Withdrawal: Taking money out of your account.
- Interest: The amount earned on your deposits or charged on your loans.

Benefits of Banking
- Safety: Banks provide a secure way to store your money.
- Convenience: Banks offer various channels to access your accounts, such as online banking, mobile banking, and ATMs.
- Financial Inclusion: Banks help you access financial services and products, promoting financial inclusion.

Tips for Beginners
- Understand your account terms: Read and understand the terms and conditions of your account.
- Keep track of your account balance: Regularly check your account balance to avoid overdrafts.
- Use online banking: Take advantage of online banking to manage your accounts and transactions conveniently.
- Ask questions: Don't hesitate to ask your bank representative if you have any questions or concerns.

I hope this helps you get started with banking!`,
    },
    {
      id: "bank-00-beginners-video",
      title: "Banking for Beginners — Video",
      type: "video",
      level: "beginner",
      link: "https://www.youtube.com/embed/AkMTxMN7res?si=U29j2rUDS4HLwKn3",
    },
    {
      id: "bank-01-intermediate-readonly",
      title: "Banking for Intermediate — Read-only (Pasted)",
      type: "text",
      level: "intermediate",
      content: `Advanced Banking Concepts- Risk Management: Sophisticated risk management techniques, such as Value-at-Risk (VaR) and Expected Shortfall (ES), to measure and mitigate market, credit, and operational risks.
- Asset Liability Management (ALM): Managing the mismatch between assets and liabilities to minimize interest rate and liquidity risks.
- Derivatives: Using financial derivatives, such as options, futures, and swaps, to hedge against market risks or speculate on price movements.

Investment Banking- Mergers and Acquisitions (M&A): Advising clients on strategic transactions, such as mergers, acquisitions, and divestitures.
- Equity and Debt Capital Markets: Raising capital for clients through equity and debt offerings, such as IPOs, follow-on offerings, and bond issuances.
- Restructuring and Reorganization: Advising clients on financial restructuring and reorganization strategies.

Treasury Management- Liquidity Management: Managing cash and liquidity positions to meet short-term funding needs.
- Funding and Capital Management: Managing funding and capital requirements to support business growth and operations.
- Investment Management: Investing excess funds in low-risk, liquid instruments to generate returns.

Digital Banking and Fintech- Digital Payment Systems: Implementing digital payment systems, such as mobile wallets and contactless payments.
- Blockchain and Distributed Ledger Technology: Exploring the potential of blockchain and distributed ledger technology for secure, transparent, and efficient transactions.
- Artificial Intelligence and Machine Learning: Leveraging AI and ML to enhance customer experience, detect fraud, and improve risk management.

Regulatory Frameworks- Basel III and IV: Understanding the latest regulatory requirements for capital adequacy, liquidity, and risk management.
- Anti-Money Laundering (AML) and Know Your Customer (KYC): Implementing effective AML and KYC frameworks to prevent financial crimes.
- General Data Protection Regulation (GDPR): Ensuring compliance with data protection regulations to safeguard customer information.

Advanced Banking Strategies- Portfolio Optimization: Optimizing investment portfolios to maximize returns while minimizing risk.
- Risk-Based Pricing: Pricing financial products and services based on the level of risk associated with each customer or transaction.
- Customer Segmentation: Segmenting customers based on their needs, behavior, and risk profiles to deliver targeted services and improve customer satisfaction.

I hope this helps you deepen your knowledge of advanced banking concepts!`,
    },
    {
      id: "bank-01-intermediate-video",
      title: "Banking for Intermediate — YouTube",
      type: "video",
      level: "intermediate",
      link: "https://www.youtube.com/embed/A9Xq3FGjpZA?si=EAdvEuPg9GwHlXWP",
    },
    {
      id: "bank-02-advanced-text",
      title: "Advanced Banking Concepts (Read-only)",
      type: "text",
      level: "advanced",
      content: `Advanced Banking Concepts- Risk Management: Sophisticated risk management techniques, such as Value-at-Risk (VaR) and Expected Shortfall (ES), to measure and mitigate market, credit, and operational risks.
- Asset Liability Management (ALM): Managing the mismatch between assets and liabilities to minimize interest rate and liquidity risks.
- Derivatives: Using financial derivatives, such as options, futures, and swaps, to hedge against market risks or speculate on price movements.

Investment Banking- Mergers and Acquisitions (M&A): Advising clients on strategic transactions, such as mergers, acquisitions, and divestitures.
- Equity and Debt Capital Markets: Raising capital for clients through equity and debt offerings, such as IPOs, follow-on offerings, and bond issuances.
- Restructuring and Reorganization: Advising clients on financial restructuring and reorganization strategies.

Treasury Management- Liquidity Management: Managing cash and liquidity positions to meet short-term funding needs.
- Funding and Capital Management: Managing funding and capital requirements to support business growth and operations.
- Investment Management: Investing excess funds in low-risk, liquid instruments to generate returns.

Digital Banking and Fintech- Digital Payment Systems: Implementing digital payment systems, such as mobile wallets and contactless payments.
- Blockchain and Distributed Ledger Technology: Exploring the potential of blockchain and distributed ledger technology for secure, transparent, and efficient transactions.
- Artificial Intelligence and Machine Learning: Leveraging AI and ML to enhance customer experience, detect fraud, and improve risk management.

Regulatory Frameworks- Basel III and IV: Understanding the latest regulatory requirements for capital adequacy, liquidity, and risk management.
- Anti-Money Laundering (AML) and Know Your Customer (KYC): Implementing effective AML and KYC frameworks to prevent financial crimes.
- General Data Protection Regulation (GDPR): Ensuring compliance with data protection regulations to safeguard customer information.

Advanced Banking Strategies- Portfolio Optimization: Optimizing investment portfolios to maximize returns while minimizing risk.
- Risk-Based Pricing: Pricing financial products and services based on the level of risk associated with each customer or transaction.
- Customer Segmentation: Segmenting customers based on their needs, behavior, and risk profiles to deliver targeted services and improve customer satisfaction.

I hope this helps you deepen your knowledge of advanced banking concepts!`,
    },
    {
      id: "bank-02-advanced-video",
      title: "Advanced Banking — Video",
      type: "video",
      level: "advanced",
      link: "https://www.youtube.com/embed/AkMTxMN7res?si=U29j2rUDS4HLwKn3",
    },
  ],
  // quiz: [
  //   { id: "q1", question: "...", options: [...], correctIndex: 1 },
  //   ...
  // ],
}

export default function Page() {
  return <LearningPage track={track} />
}
