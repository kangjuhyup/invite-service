import { StorageService } from "@storage/storage.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class LetterService {
      constructor(
        private readonly storage: StorageService
      ) {}
}