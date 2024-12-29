import mailSender from "@/utils/nodemailer";

class EmailService {
  private transporter;

  constructor() {
    this.transporter = mailSender();
  }

  async sendOrderConfirmationEmail(customerEmail: string, orderDetails: Record<any, any>) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: customerEmail,
      subject: 'Order Confirmation',
      text: `Thank you for your order! Here are your order details:\n\nOrder ID: ${orderDetails.id}\nItems: ${orderDetails.items.join(', ')}\nTotal: ${orderDetails.total}\n\nYour order will be processed shortly.`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Order confirmation email sent');
    } catch (error) {
      console.error('Error sending order confirmation email:', error);
    }
  }

  async sendOwnerNotificationEmail(orderDetails: Record<any, any>) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.OWNER_EMAIL, 
      subject: 'New Order Placed',
      text: `A new order has been placed. Here are the details:\n\nOrder ID: ${orderDetails.id}\nItems: ${orderDetails.items.join(', /n')}\nTotal: ${orderDetails.total}\nPlease process this order as soon as possible.`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Owner notification email sent');
    } catch (error) {
      console.error('Error sending owner notification email:', error);
    }
  }
}

export default EmailService;
