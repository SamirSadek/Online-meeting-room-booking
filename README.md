
**Installation Guide** 

---

### **1. Clone the Repository**

To clone the repository, follow these steps:

- Open your terminal or command prompt.
- Run the following command to clone the repository (replace `<repository-url>` with the actual URL of the repository):

```bash
git clone <repository-url>
```

Example:

```bash
git clone https://github.com/your-username/your-repo.git
```

- Navigate into the project directory:

```bash
cd your-repo
```

---

### **2. Install Dependencies**

Once inside the project directory, you need to install the necessary dependencies. You can use **npm** or **yarn**, depending on what the project uses.

- **Using npm**:

```bash
npm install
```

- **Using yarn**:

```bash
yarn install
```

---

### **3. Create `.env` File from `.env.example`**

In order to configure your environment variables, follow these steps:

- Copy the **`.env.example`** file to create a new **`.env`** file in the root of your project:

```bash
cp .env.example .env
```

- Open the `.env` file and replace the placeholder values with your actual credentials (if needed).

### **Sample `.env.example` File:**

Here is a template for your `.env.example` file, with placeholders:

```env
# Clerk API Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key
CLERK_SECRET_KEY=sk_test_your_secret_key

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Database URL (Example, replace with your own credentials)
DATABASE_URL="mysql://username:password@hostname:port/database"
```

- **Replace**:
  - `pk_test_your_publishable_key` with your Clerk publishable key.
  - `sk_test_your_secret_key` with your Clerk secret key.
  - `mysql://username:password@hostname:port/database` with your own database credentials.

---

### **4. Configure Database (If Using Prisma)**

If you're using **Prisma** for database interaction, ensure the following steps are done:

- Update the `DATABASE_URL` in your `.env` file to match your actual database connection string.
- If this is the first time setting up the database, run Prisma's migration command:

```bash
npx prisma migrate dev --name init
```

This command will apply your Prisma schema to the database.

---

### **5. Run the Application**

After installing the dependencies and setting up the environment variables, you can now run the application.

- **Using npm**:

```bash
npm run dev
```

- **Using yarn**:

```bash
yarn dev
```

This should start the application and it will be accessible at `http://localhost:3000`.

---

### **6. Additional Configuration (Optional)**

If the project involves more configurations (e.g., Clerk setup, Prisma Client, etc.), ensure that those dependencies are also correctly set up according to the project's documentation.

---

### **7. Git Ignore Sensitive Data**

Make sure that your **`.env`** file is **not** committed to the repository by adding it to `.gitignore`. The **`.env`** file should only exist locally on your machine.

Add the following line to your `.gitignore`:

```
.env
```

---

![WhatsApp Image 2025-02-19 at 10 03 16_369b8b98](https://github.com/user-attachments/assets/71d7dbe8-8ea5-4169-9d64-837afae22071)
![WhatsApp Image 2025-02-19 at 10 03 36_bba2a168](https://github.com/user-attachments/assets/b596742b-b4b7-43c8-b11c-d2c954ab8102)
![WhatsApp Image 2025-02-19 at 10 03 58_f5e35d22](https://github.com/user-attachments/assets/2feb7e12-34fc-40da-a571-f583171359d1)
![WhatsApp Image 2025-02-19 at 10 04 33_a892744e](https://github.com/user-attachments/assets/e2b18f23-aae4-46f2-b1cd-473545784ec4)
![WhatsApp Image 2025-02-19 at 10 04 52_4b2d5f05](https://github.com/user-attachments/assets/77c7346c-eda3-4a20-86c5-d0f7febcb2bb)




