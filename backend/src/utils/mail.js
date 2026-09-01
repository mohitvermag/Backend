import nodemailer from "nodemailer";


const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,

    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    }
});

export const sendAdminApprovalEmail = async ({
    username,
    email,
    mobile,
    approvalToken
}) => {

    const approveUrl =
        `${process.env.BACKEND_URL}/api/v1/auth/admin/approve/${approvalToken}`;

    const rejectUrl =
        `${process.env.BACKEND_URL}/api/v1/auth/admin/reject/${approvalToken}`;

    await transport.sendMail({

        from: `MohitVerma <${process.env.SMTP_USER}>`,

        to: process.env.ADMIN_APPROVAL_EMAIL,

        subject: "🔐 Admin Registration Approval Required",

        html: `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <title>Admin Registration Approval</title>
</head>

<body style="
    margin:0;
    padding:0;
    background:#f1f5f9;
    font-family:Arial, Helvetica, sans-serif;
">

<table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="
        background:#f1f5f9;
        padding:40px 15px;
    "
>

<tr>
<td align="center">

<table
    width="600"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="
        max-width:600px;
        width:100%;
        background:#ffffff;
        border-radius:18px;
        overflow:hidden;
        box-shadow:0 10px 35px rgba(15,23,42,0.08);
    "
>
<tr>
<td style="
    background:#0f172a;
    padding:38px 30px;
    text-align:center;
">

    <div style="
        width:64px;
        height:64px;
        line-height:64px;
        margin:0 auto 18px;
        background:#1e293b;
        border-radius:50%;
        font-size:30px;
    ">
        🔐
    </div>

    <h1 style="
        margin:0;
        color:#ffffff;
        font-size:25px;
        font-weight:700;
    ">
        Admin Approval Required
    </h1>

    <p style="
        margin:10px 0 0;
        color:#cbd5e1;
        font-size:14px;
        line-height:1.5;
    ">
        A new administrator registration request
        requires your approval.
    </p>

</td>
</tr>

<tr>
<td style="padding:35px 32px;">

    <h2 style="
        margin:0 0 10px;
        color:#0f172a;
        font-size:21px;
    ">
        New Admin Registration
    </h2>

    <p style="
        margin:0 0 25px;
        color:#64748b;
        font-size:14px;
        line-height:1.6;
    ">
        Someone has requested an administrator account.
        Please review the information below before making
        your decision.
    </p>


    <table
        width="100%"
        cellpadding="0"
        cellspacing="0"
        border="0"
        style="
            background:#f8fafc;
            border:1px solid #e2e8f0;
            border-radius:12px;
            margin-bottom:28px;
        "
    >

    <tr>
    <td style="padding:20px 22px;">

        <p style="
            margin:0 0 14px;
            color:#94a3b8;
            font-size:11px;
            text-transform:uppercase;
            letter-spacing:1px;
            font-weight:700;
        ">
            Registration Details
        </p>


        <table
            width="100%"
            cellpadding="0"
            cellspacing="0"
            border="0"
        >

        <tr>
            <td style="
                padding:8px 0;
                color:#64748b;
                font-size:13px;
                width:35%;
            ">
                Username
            </td>

            <td style="
                padding:8px 0;
                color:#0f172a;
                font-size:14px;
                font-weight:600;
            ">
                ${username}
            </td>
        </tr>


        <tr>
            <td style="
                padding:8px 0;
                color:#64748b;
                font-size:13px;
            ">
                Email
            </td>

            <td style="
                padding:8px 0;
                color:#0f172a;
                font-size:14px;
                font-weight:600;
            ">
                ${email}
            </td>
        </tr>


        <tr>
            <td style="
                padding:8px 0;
                color:#64748b;
                font-size:13px;
            ">
                Mobile
            </td>

            <td style="
                padding:8px 0;
                color:#0f172a;
                font-size:14px;
                font-weight:600;
            ">
                ${mobile}
            </td>
        </tr>

        </table>

    </td>
    </tr>

    </table>


    <p style="
        margin:0 0 20px;
        color:#475569;
        font-size:14px;
        text-align:center;
        line-height:1.6;
    ">
        Please choose an action below:
    </p>


    <table
        width="100%"
        cellpadding="0"
        cellspacing="0"
        border="0"
    >

    <tr>

        <td
            width="48%"
            align="center"
            style="padding-right:5px;"
        >

            <a
                href="${approveUrl}"
                style="
                    display:block;
                    background:#16a34a;
                    color:#ffffff;
                    text-decoration:none;
                    padding:14px 10px;
                    border-radius:10px;
                    font-size:14px;
                    font-weight:700;
                    text-align:center;
                "
            >
                ✓ &nbsp; Approve Request
            </a>

        </td>

        <td
            width="48%"
            align="center"
            style="padding-left:5px;"
        >

            <a
                href="${rejectUrl}"
                style="
                    display:block;
                    background:#dc2626;
                    color:#ffffff;
                    text-decoration:none;
                    padding:14px 10px;
                    border-radius:10px;
                    font-size:14px;
                    font-weight:700;
                    text-align:center;
                "
            >
                ✕ &nbsp; Reject Request
            </a>

        </td>

    </tr>

    </table>

    <table
        width="100%"
        cellpadding="0"
        cellspacing="0"
        border="0"
        style="
            margin-top:28px;
            background:#fffbeb;
            border:1px solid #fde68a;
            border-radius:10px;
        "
    >

    <tr>
    <td style="padding:15px 17px;">

        <p style="
            margin:0 0 5px;
            color:#92400e;
            font-size:12px;
            font-weight:700;
        ">
            ⚠️ Security Notice
        </p>

        <p style="
            margin:0;
            color:#92400e;
            font-size:12px;
            line-height:1.5;
        ">
            Only approve this request if you recognize the
            applicant and have verified that they should
            receive administrator access.
        </p>

    </td>
    </tr>

    </table>


    <p style="
        margin:22px 0 0;
        color:#94a3b8;
        font-size:11px;
        line-height:1.5;
        text-align:center;
    ">
        This approval request is valid for 24 hours.
        After that, the approval links will expire.
    </p>

</td>
</tr>

<tr>
<td style="
    padding:22px 25px;
    background:#f8fafc;
    border-top:1px solid #e2e8f0;
    text-align:center;
">

    <p style="
        margin:0 0 6px;
        color:#64748b;
        font-size:12px;
        font-weight:600;
    ">
        Backend Authentication System
    </p>

    <p style="
        margin:0;
        color:#94a3b8;
        font-size:10px;
        line-height:1.5;
    ">
        This is an automated security email.
        Please do not reply to this message.
    </p>

</td>
</tr>

</table>

</td>
</tr>

</table>

</body>
</html>
`
    });
};


export const sendPasswordResetOTP = async ({
    email,
    otp
}) => {

    await transport.sendMail({
        from: `MohitVerma <${process.env.SMTP_USER}>`,
        to: email,
        subject: "Password Reset OTP",

        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>

            <body style="
                margin: 0;
                padding: 0;
                background-color: #f1f5f9;
                font-family: Arial, Helvetica, sans-serif;
            ">

                <table width="100%" cellpadding="0" cellspacing="0" border="0"
                    style="padding: 40px 15px; background-color: #f1f5f9;">

                    <tr>
                        <td align="center">

                            <table width="600" cellpadding="0" cellspacing="0" border="0"
                                style="
                                    max-width: 600px;
                                    width: 100%;
                                    background-color: #ffffff;
                                    border-radius: 16px;
                                    overflow: hidden;
                                ">

                                <tr>
                                    <td style="
                                        background: #0f172a;
                                        padding: 30px;
                                        text-align: center;
                                    ">

                                        <div style="
                                            font-size: 35px;
                                            margin-bottom: 10px;
                                        ">
                                            🔐
                                        </div>

                                        <h1 style="
                                            margin: 0;
                                            color: #ffffff;
                                            font-size: 24px;
                                        ">
                                            Password Reset
                                        </h1>

                                        <p style="
                                            margin: 8px 0 0;
                                            color: #cbd5e1;
                                            font-size: 13px;
                                        ">
                                            Verify your identity to continue
                                        </p>

                                    </td>
                                </tr>

                                <tr>
                                    <td style="padding: 35px;">

                                        <h2 style="
                                            margin: 0 0 12px;
                                            color: #0f172a;
                                        ">
                                            Password Reset Request
                                        </h2>

                                        <p style="
                                            color: #64748b;
                                            font-size: 14px;
                                            line-height: 1.6;
                                        ">
                                            We received a request to reset the
                                            password associated with your account.
                                        </p>

                                        <p style="
                                            color: #64748b;
                                            font-size: 14px;
                                        ">
                                            Use the verification code below:
                                        </p>

                                        <div style="
                                            margin: 25px 0;
                                            padding: 20px;
                                            text-align: center;
                                            background-color: #f8fafc;
                                            border: 1px solid #e2e8f0;
                                            border-radius: 12px;
                                        ">

                                            <div style="
                                                color: #0f172a;
                                                font-size: 34px;
                                                font-weight: 700;
                                                letter-spacing: 10px;
                                            ">
                                                ${otp}
                                            </div>

                                        </div>

                                        <p style="
                                            color: #dc2626;
                                            font-size: 13px;
                                            font-weight: 600;
                                        ">
                                            ⏱ This OTP expires in 5 minutes.
                                        </p>

                                        <p style="
                                            color: #64748b;
                                            font-size: 13px;
                                            line-height: 1.6;
                                        ">
                                            If you did not request a password
                                            reset, you can safely ignore this email.
                                        </p>

                                    </td>
                                </tr>

                                <tr>
                                    <td style="
                                        padding: 20px;
                                        text-align: center;
                                        background-color: #f8fafc;
                                        border-top: 1px solid #e2e8f0;
                                    ">

                                        <p style="
                                            margin: 0;
                                            color: #94a3b8;
                                            font-size: 11px;
                                        ">
                                            This is an automated security email.
                                            Please do not reply.
                                        </p>

                                    </td>
                                </tr>

                            </table>

                        </td>
                    </tr>

                </table>

            </body>
            </html>
        `
    });
};