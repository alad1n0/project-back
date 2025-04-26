import {Injectable} from '@nestjs/common';
import {BasketItem} from '@prisma/client';

@Injectable()
export class BasketFormatter {
    format(item: BasketItem, deleted = false) {
        return {
            id: item.id,
            productId: item.productId,
            quantity: item.quantity,
            deleted,
            updatedAt: item.updatedAt,
        };
    }
}
