import {Injectable} from "@nestjs/common";
import {infobipConfig} from "../../config/infobip.config";
import * as https from "node:https";

@Injectable()
export class OtpService {
    sendOtpCode = async (phone: string, otp: string) => {
        const { apiKey, sender } = infobipConfig;

        const formattedPhone = phone.replace(/\s+/g, '');

        const data = JSON.stringify({
            "messages": [
                {
                    "destinations": [{ "to": formattedPhone }],
                    "from": sender,
                    "text": `Your OTP code is: ${otp}`,
                },
            ],
        });

        const options = {
            method: 'POST',
            hostname: 'z3n346.api.infobip.com',
            path: '/sms/2/text/advanced',
            headers: {
                'Authorization': `App ${apiKey}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            maxRedirects: 20,
        };

        return new Promise<boolean>((resolve, reject) => {
            const req = https.request(options, (res) => {
                let chunks: any[] = [];

                res.on('data', (chunk) => {
                    chunks.push(chunk);
                });

                res.on('end', () => {
                    const body = Buffer.concat(chunks);
                    console.log(body.toString());

                    if (res.statusCode === 200) {
                        resolve(true);
                    } else {
                        console.error('Failed to send OTP code', body.toString());
                        resolve(false);
                    }
                });

                res.on('error', (error) => {
                    console.error('Request error:', error);
                    reject(false);
                });
            });

            req.write(data);

            req.end();
        });
    };
}