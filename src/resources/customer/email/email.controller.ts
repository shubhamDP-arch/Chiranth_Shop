import { Router } from "express";
import EmailService from "./email.service";
import { Request, Response, NextFunction } from "express";
import HttpException from "@/utils/exceptions/http.exception";
import validate from "@/resources/customer/email/email.validate"; 
import validationMiddleware from "@/middleware/validation.middleware";

class EmailNotificationController {
    public path = "/email-notifications";
    public router = Router();
    private emailService = new EmailService(); 
    constructor() {
        this.initialiseRoutes();
    }

    private initialiseRoutes(): void {
        /**
         * @swagger
         * /email-notifications/send-order-confirmation:
         *   post:
         *     summary: Send order confirmation to customer and notify store owner
         *     tags:
         *       - Email Notifications
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               customerEmail:
         *                 type: string
         *                 example: customer@example.com
         *               orderDetails:
         *                 type: object
         *                 properties:
         *                   id:
         *                     type: string
         *                     example: 12345
         *                   items:
         *                     type: array
         *                     items:
         *                       type: string
         *                     example: ['Laptop', 'Keyboard']
         *                   total:
         *                     type: number
         *                     example: 1599.99
         *     responses:
         *       200:
         *         description: Emails sent successfully
         *       400:
         *         description: Bad request
         */
        this.router.post(
            `${this.path}/send-order-confirmation`,
            validationMiddleware(validate.orderNotificationValidation), 
            this.sendOrderConfirmation
        );
    }

    private sendOrderConfirmation = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { customerEmail, orderDetails } = req.body;



            // customer
            await this.emailService.sendOrderConfirmationEmail(customerEmail, orderDetails);

            // owner
            await this.emailService.sendOwnerNotificationEmail(orderDetails);

            res.status(200).json({ message: "Order confirmation and owner notification sent successfully" });
        } catch (error: any) {
            next(new HttpException(500, error.message));
        }
    };
}

export default EmailNotificationController;
