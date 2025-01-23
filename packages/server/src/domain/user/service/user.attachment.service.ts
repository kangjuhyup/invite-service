import { AttachmentBaseService } from '@app/domain/letter/service/letter.base.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserAttachmentService extends AttachmentBaseService {
  constructor() {
    super();
  }
}
