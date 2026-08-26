import nodemailer from "nodemailer";

export const sendAdminApprovalEmail = async({
    username, email,mobile, approvalToken,
})=>{
    const transport = nodemailer.createTransport({
        host:process.env.SMTP_HOST,
        port:Number(process.env.SMTP_PORT),
        secure:false,
        auth:{
            user:process.env.SMTP_USER,
            pass:process.env.SMTP_PASSWORD
        }
    });

    const approveUrl = `${process.env.BACKEND_URL}/api/v1/auth/admin/approve/${approvalToken}`;
    const rejectUrl = `${process.env.BACKEND_URL}/api/v1/auth/admin/reject/${approvalToken}`;

    await transport.sendMail({
        from:`MohitVerma <${process.env.SMTP_USER}>`,
        to:process.env.ADMIN_APPROVAL_EMAIL,
        subject:"Admin Registration Approval Request",
        html:`
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Admin Registration Request</title>
</head>

<body style="
    margin: 0;
    padding: 0;
    background-color: #f1f5f9;
    font-family: Arial, Helvetica, sans-serif;
">

    <table width="100%" cellpadding="0" cellspacing="0" border="0"
        style="background-color: #f1f5f9; padding: 40px 15px;">

        <tr>
            <td align="center">

                <table width="600" cellpadding="0" cellspacing="0" border="0"
                    style="
                        max-width: 600px;
                        width: 100%;
                        background-color: #ffffff;
                        border-radius: 16px;
                        overflow: hidden;
                        box-shadow: 0 8px 30px rgba(15, 23, 42, 0.08);
                    ">

                    <tr>
                        <td style="
                            background: linear-gradient(
                                135deg,
                                #0f172a,
                                #1e293b
                            );
                            padding: 30px;
                            text-align: center;
                        ">

                            <div style="
                                display: inline-block;
                                background-color: #334155;
                                border-radius: 12px;
                                padding: 12px;
                                font-size: 24px;
                            ">
                                🔐
                            </div>

                            <h1 style="
                                margin: 15px 0 5px;
                                color: #ffffff;
                                font-size: 24px;
                                font-weight: 700;
                            ">
                                Admin Access Request
                            </h1>

                            <p style="
                                margin: 0;
                                color: #cbd5e1;
                                font-size: 14px;
                            ">
                                Approval required for administrator access
                            </p>

                        </td>
                    </tr>


                    <tr>
                        <td style="padding: 35px 35px 20px;">

                            <h2 style="
                                margin: 0 0 10px;
                                color: #0f172a;
                                font-size: 20px;
                            ">
                                New Admin Registration
                            </h2>

                            <p style="
                                margin: 0 0 25px;
                                color: #64748b;
                                font-size: 14px;
                                line-height: 1.7;
                            ">
                                A new user has requested an administrator
                                account for your application. Please review
                                the details below before granting access.
                            </p>


                            <table width="100%" cellpadding="0" cellspacing="0"
                                style="
                                    background-color: #f8fafc;
                                    border: 1px solid #e2e8f0;
                                    border-radius: 12px;
                                ">

                                <tr>
                                    <td style="
                                        padding: 16px 18px;
                                        border-bottom: 1px solid #e2e8f0;
                                    ">
                                        <span style="
                                            color: #64748b;
                                            font-size: 12px;
                                        ">
                                            USERNAME
                                        </span>

                                        <br>

                                        <strong style="
                                            color: #0f172a;
                                            font-size: 15px;
                                        ">
                                            ${username}
                                        </strong>
                                    </td>
                                </tr>


                                <tr>
                                    <td style="
                                        padding: 16px 18px;
                                        border-bottom: 1px solid #e2e8f0;
                                    ">
                                        <span style="
                                            color: #64748b;
                                            font-size: 12px;
                                        ">
                                            EMAIL ADDRESS
                                        </span>

                                        <br>

                                        <strong style="
                                            color: #0f172a;
                                            font-size: 15px;
                                        ">
                                            ${email}
                                        </strong>
                                    </td>
                                </tr>


                                <tr>
                                    <td style="
                                        padding: 16px 18px;
                                    ">
                                        <span style="
                                            color: #64748b;
                                            font-size: 12px;
                                        ">
                                            MOBILE NUMBER
                                        </span>

                                        <br>

                                        <strong style="
                                            color: #0f172a;
                                            font-size: 15px;
                                        ">
                                            ${mobile}
                                        </strong>
                                    </td>
                                </tr>

                            </table>


                            <div style="
                                margin-top: 25px;
                                padding: 14px 16px;
                                background-color: #fffbeb;
                                border: 1px solid #fde68a;
                                border-radius: 10px;
                            ">

                                <span style="
                                    color: #92400e;
                                    font-size: 13px;
                                    font-weight: 600;
                                ">
                                    ⏳ PENDING APPROVAL
                                </span>

                                <p style="
                                    margin: 5px 0 0;
                                    color: #78350f;
                                    font-size: 12px;
                                ">
                                    Please review this request and choose
                                    whether to approve or reject it.
                                </p>

                            </div>


                            <table width="100%" cellpadding="0" cellspacing="0"
                                style="margin-top: 30px;">

                                <tr>

                                    <td align="center" width="50%"
                                        style="padding-right: 7px;">

                                        <a href="${approveUrl}"
                                            style="
                                                display: block;
                                                background-color: #16a34a;
                                                color: #ffffff;
                                                text-decoration: none;
                                                padding: 14px 10px;
                                                border-radius: 9px;
                                                font-size: 14px;
                                                font-weight: 700;
                                            ">
                                            ✓ &nbsp; APPROVE REQUEST
                                        </a>

                                    </td>


                                    <td align="center" width="50%"
                                        style="padding-left: 7px;">

                                        <a href="${rejectUrl}"
                                            style="
                                                display: block;
                                                background-color: #dc2626;
                                                color: #ffffff;
                                                text-decoration: none;
                                                padding: 14px 10px;
                                                border-radius: 9px;
                                                font-size: 14px;
                                                font-weight: 700;
                                            ">
                                            ✕ &nbsp; REJECT REQUEST
                                        </a>

                                    </td>

                                </tr>

                            </table>


                            <div style="
                                margin-top: 30px;
                                padding-top: 20px;
                                border-top: 1px solid #e2e8f0;
                            ">

                                <p style="
                                    margin: 0;
                                    color: #64748b;
                                    font-size: 12px;
                                    line-height: 1.7;
                                ">
                                    🔒 <strong>Security notice:</strong>
                                    This approval request is private and
                                    should only be reviewed by an authorized
                                    administrator.
                                </p>

                                <p style="
                                    margin: 8px 0 0;
                                    color: #94a3b8;
                                    font-size: 11px;
                                ">
                                    The approval link is temporary and should
                                    not be shared with anyone.
                                </p>

                            </div>

                        </td>
                    </tr>


                    <tr>
                        <td style="
                            background-color: #f8fafc;
                            padding: 22px 30px;
                            text-align: center;
                            border-top: 1px solid #e2e8f0;
                        ">

                            <p style="
                                margin: 0;
                                color: #64748b;
                                font-size: 12px;
                            ">
                                This is an automated security notification.
                            </p>

                            <p style="
                                margin: 6px 0 0;
                                color: #94a3b8;
                                font-size: 11px;
                            ">
                                Please do not reply to this email.
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
    })
}
