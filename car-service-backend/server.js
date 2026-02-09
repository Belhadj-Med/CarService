const express = require("express");
const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const Admin = require("./models/Admin");
let ADMIN_SESSION = null; // in-memory session (resets on server restart)

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connecté"))
  .catch((err) => console.error("Erreur MongoDB :", err));

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); 

let ADMIN_PASSCODE;

const initAdmin = async () => {
  try {
    let admin = await Admin.findOne();
    if (!admin) {
      admin = new Admin({ passcode: "1234" });
      await admin.save();
    }
    ADMIN_PASSCODE = admin.passcode;
    console.log("Admin passcode loaded");
  } catch (err) {
    console.error("Error initializing admin passcode:", err);
  }
};

initAdmin();

app.get("/", (req, res) => {
  res.send("Backend is running!");
});


app.post("/admin/login", async (req, res) => {
  try {
    const { passcode } = req.body;

    if (!passcode) {
      return res.status(400).json({ error: "Passcode is required" });
    }

    const admin = await Admin.findOne();
    if (!admin) {
      return res.status(500).json({ error: "Admin not found in DB" });
    }

    if (passcode !== admin.passcode) {
      return res.status(401).json({ error: "Incorrect passcode" });
    }

    ADMIN_SESSION = Math.random().toString(36).substring(2, 15);

    return res.status(200).json({ message: "Login successful", token: ADMIN_SESSION });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Server error" }); // <- JSON guaranteed
  }
});

const verifyAdmin = (req, res, next) => {
  const token = req.headers["x-admin-token"];
  if (!token || token !== ADMIN_SESSION) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
};

app.get("/adm/dashboard", verifyAdmin, async (req, res) => {
  try {
    const requests = await ServiceRequest.find().sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


app.post("/admin/change-passcode", async (req, res) => {
  const { newPasscode } = req.body;

  if (!newPasscode) {
    return res.status(400).json({ error: "New passcode is required" });
  }

  try {
    let admin = await Admin.findOne();
    if (!admin) {
      admin = new Admin({ passcode: newPasscode });
    } else {
      admin.passcode = newPasscode;
    }
    await admin.save();

    ADMIN_PASSCODE = newPasscode;
    res.status(200).json({ message: "Passcode updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/contact", async (req, res) => {
  const { email, message } = req.body;

  if (!email || !message) {
    return res
      .status(400)
      .json({ error: "الرجاء إدخال البريد والرسالة" });
  }

  try {
    await resend.emails.send({
  from: `${email} <onboarding@resend.dev>`,
  to: process.env.EMAIL_USER,
  subject: "رسالة جديدة من موقع Car Service",
  text:`البريد الإلكتروني: ${email}\nالرسالة: ${message}`,
});

    res.status(200).json({ message: "تم إرسال الرسالة بنجاح" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "حدث خطأ أثناء إرسال الرسالة" });
  }
});

const ServiceRequest = require("./models/ServiceRequest");

app.post("/service", async (req, res) => {
  const { name, phone, address, carType, carModel, engine, oilType } =
    req.body;

  if (
    !name ||
    !phone ||
    !address ||
    !carType ||
    !carModel ||
    !engine ||
    !oilType
  ) {
    return res
      .status(400)
      .json({ error: "الرجاء تعبئة كامل الاستمارة" });
  }

  try {
    const newRequest = new ServiceRequest({
      name,
      phone,
      address,
      carType,
      carModel,
      engine,
      oilType,
    });

    await newRequest.save();

    await resend.emails.send({
  from: "Car Service <onboarding@resend.dev>",
  to: process.env.EMAIL_USER,
  subject: "📩 Nouvelle demande de service - Car Service",
  text: `
Nouvelle demande de service reçue:

Nom: ${name}
Téléphone: ${phone}
Adresse: ${address}
Type de voiture: ${carType}
Modèle: ${carModel}
Moteur: ${engine}
Type d'huile: ${oilType}
  `,
});

    res.status(200).json({
      message:
        " لقد تم استلام طلبكم ,سنقوم بالاتصال بكم في اقرب الاجال .\n شكرا على ثقتكم !",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.get("/admin/services", async (req, res) => {
  const requests = await ServiceRequest.find();
  res.json(requests);
});

app.delete("/admin/services/:id", async (req, res) => {
  await ServiceRequest.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted successfully" });
});
app.delete("/service/:id", verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await ServiceRequest.findByIdAndDelete(id);
    res.status(200).json({ message: "Request deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
