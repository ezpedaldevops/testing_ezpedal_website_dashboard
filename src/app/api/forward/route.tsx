// import { NextResponse, NextRequest } from "next/server";
// import nodemailer from "nodemailer";
// // import { supabase } from "@/lib/supabase";
// import { generateApplicationEmailTemplate } from "@/lib/utils";

// export async function POST(req: NextRequest): Promise<NextResponse> {

//     const { type, idArray } = await req.json();


//     if (!type || !idArray) {
//         return NextResponse.json({ message: "Invalid request" }, { status: 400 });
//     }

//     let toArray: string[];

//     switch (type) {
//         case "corporate_forms":
//         case "residential_forms":
//         case "advertisement_forms":
//             toArray = ["nikheel@ezpedal.in", "samrat.singh@ezpedal.in", "info@ezpedal.in"]
//             break;
//         case "career_forms":
//             toArray = ["manjiri.shinde@ezpedal.in", "info@ezpedal.in"]
//             break;
//         default:
//             return NextResponse.json({ message: "Invalid type" }, { status: 400 });
//     }


//     //get all the responses from supabase based on the type and idArray
//     const { data: responses, error } = await supabase
//         .from(type)
//         .select("*")
//         .in("id", idArray);

//     if (error) {
//         return NextResponse.json({ message: "Error fetching responses" }, { status: 500 });
//     }

//     const transporter = nodemailer.createTransport({
//         service: 'gmail',
//         auth: {
//             user: process.env.NEXT_PUBLIC_MAIL_USERNAME,
//             pass: process.env.NEXT_PUBLIC_MAIL_PASSWORD
//         }
//     });

//     await new Promise((resolve, reject) => {
//         // verify connection configuration
//         transporter.verify(function (error, success) {
//             if (error) {
//                 console.log(error);
//                 reject(error);
//             } else {
//                 console.log("Server is ready to take our messages");
//                 resolve(success);
//             }
//         });
//     });


//     try {
//         const emailPromises = responses.map((response) => {
//             const mailTemplate = generateApplicationEmailTemplate(type, response);
       

//             const mailOptions = {
//                 from: `Website Application Manager<${process.env.NEXT_PUBLIC_MAIL_USERNAME}>`,
//                 to: toArray,
//                 subject: `New ${type} Application`,
//                 html: mailTemplate,
//             };

//             // Return the promise for sending mail
//             return new Promise((resolve, reject) => {
//                 transporter.sendMail(mailOptions, (err, info) => {
//                     if (err) {
//                         console.error("Error sending email:", err);
//                         reject(err);
//                     } else {
//                         console.log("Email sent:", info);
//                         resolve(info);
//                     }
//                 });
//             });
//         });

//         // Wait for all emails to be sent
//         await Promise.all(emailPromises);

//         return NextResponse.json({ message: "Emails sent" });
//     }
//     catch (error) {
//         console.error("Error sending emails:", error);
//         return NextResponse.json({ message: "Error sending emails" }, { status: 500 });
//     }

// }




export async function POST() {



}