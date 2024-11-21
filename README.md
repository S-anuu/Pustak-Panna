# **PustakPanna**  
An online bookstore platform that allows users to explore, purchase, and manage books effortlessly. Designed for book lovers and administrators to create a seamless shopping experience.

---

## **Table of Contents**  
- [Features](#features)  
- [Technologies Used](#technologies-used)  
- [Screenshots](#screenshots)  
- [Installation](#installation)  
- [Usage](#usage)  
- [Contributing](#contributing)   

---

## **Features**  

### **User Features**  
- **User Authentication:** Secure login and registration.  
- **Book Management:** Browse and search for books by category, author, or title.  
- **Cart Functionality:** Add, update, and remove books from the cart.  
- **Coupon Management:** Apply discounts using valid coupons.  
- **Return Handling:** Initiate book returns through a smooth process.

### **Admin Features**  
- **Inventory Management:** Add, update, and delete books from the catalog.  
- **Coupon Generation:** Create and manage promotional coupons.  
- **User Monitoring:** Oversee user activity and manage returns.

---

## **Technologies Used**  
- **Frontend:** HTML, CSS, JavaScript  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB  
- **Other Tools:** bcrypt.js (password hashing), JWT (authentication), Mongoose  

---

## **Screenshots**  

### Home Page  
![Home Page](/Screenshots/home-page.png)

### Book Details  
![Book Details](/Screenshots/book-details.png)

### Cart  
![Cart Page](/Screenshots/cart.png)

### Admin Dashboard  
![Admin Dashboard](/Screenshots/admin-dashboard.png)

### Admin Coupons Page
![Admin Coupons Page](/Screenshots/coupons-admin.png)

---

## **Installation**  

### **1. Clone the Repository:**  
```bash
git clone https://github.com/S-anuu/Pustak-Panna.git
cd Pustak-Panna
```

### **2. Install Dependencies:**
```bash
npm install
npm install dotenv
```

### **3. Set Up Environment Variables:**
```bash
cd Backend
touch .env
```

### ***Add these to the .env file:***
<p>PORT=5000</p>
<p>MONGO_URI=your-mongodb-connection-string</p>
SECRET_KEY=your-secret-key

### ***How to Generate the JWT_SECRET:***
To generate a secure secret key for your JWT authentication, you can use the following command:

#### In Linux/Mac:
```bash
openssl rand -base64 64
```

#### In Windows (using PowerShell):
```powershell
[convert]::ToBase64String((New-Object System.Security.Cryptography.RNGCryptoServiceProvider).GetBytes(64))
```

Copy the generated string and paste it as the value for JWT_SECRET.

### **4. Run the Application:**
```bash
npm start
```

## **Usage:**
<p>User: Sign up or log in to browse the catalog, add items to the cart, and checkout.</p>
Admin: Log in to the admin dashboard to manage books, coupons, and user requests.

## **Contributing:**
Contributions are welcome! <br> Please fork the repository, make your changes, and submit a pull request.

#
