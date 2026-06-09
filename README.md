# East Devs Community (EDC) Project

Welcome to the **East Devs Community (EDC)** platform! 

- **Project URL:** [https://edc.antsar.et](https://edc.antsar.et)
- **Community:** [https://t.me/east_devs_community](https://t.me/east_devs_community)

## Folder Structure

We follow a **Modular Architecture** to keep the codebase clean, scalable, and easy to navigate. Here are our core folder structure rules:

- **`src/app/`**: Handles Next.js routing, pages, and layouts. Keep business logic outside of page files when possible.
- **`src/components/`**: UI components are organized modularly. 
  - `ui/`: Generic, reusable, and stateless UI components (e.g., buttons, inputs).
  - `commen/`: Shared components used across different features of the platform.
- **`src/lib/`**: Core utilities, database clients (`prisma.ts`), and third-party integrations (`telegram-bot.ts`).
- **`src/hooks/`**: Reusable custom React hooks.
- **Feature Separation**: Where applicable, keep related logic, components, and utilities close to their respective domains.

Here is an overview of the project's directory tree:

```
.
├── docs
│   ├── api.md
│   ├── db.md
│   ├── test.js
│   └── web
├── prisma
│   ├── schema.prisma
│   └── seed.ts
├── public
│   ├── favicon.svg
│   ├── icons.svg
│   └── logo.jpg
├── src
│   ├── app
│   │   ├── api
│   │   ├── (community)
│   │   ├── files
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── tw-animate.css
│   ├── assets
│   ├── components
│   │   ├── commen
│   │   └── ui
│   ├── generated
│   │   └── prisma
│   ├── hooks
│   └── lib
├── package.json
├── next.config.js
├── tailwind.config.js
└── ...other configuration files
```

## Local Environment Setup

To run and implement this project on your local environment, you will need the following installed:

- **Node.js**: (Version compatible with Next.js & Prisma)
- **Database**: **MariaDB 10.6.27-MariaDB - MariaDB Server**

### Setup Instructions

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```
2. Set up your `.env` file with your local MariaDB credentials.
3. Run Prisma database generation and push the schema:
   ```bash
   npx prisma generate
   npx prisma db push
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Contributing

We welcome contributions from the community! 

Anybody who contributes to the project will be listed on our **[Legacy Wall](https://edc.antsar.et/legacy-wall)** as a token of appreciation for helping build and improve our platform.

Thank you for being part of the East Devs Community!
