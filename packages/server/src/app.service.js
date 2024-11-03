"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const background_removal_node_1 = require("@imgly/background-removal-node");
const common_1 = require("@nestjs/common");
const path = require("path");
const fs = require("fs/promises");
let AppService = class AppService {
    async onModuleInit() {
        this.config = {
            debug: false,
            progress: (key, current, total) => {
                const [type, subtype] = key.split(':');
                console.log(`${type} ${subtype} ${((current / total) * 100).toFixed(0)}%`);
            },
            model: 'small',
            output: {
                quality: 0.8,
                format: 'image/jpeg',
            },
        };
    }
    getHello() {
        return 'Hello World!';
    }
    async removeBackground(file) {
        console.time();
        const before = new Blob([file.buffer], { type: 'image/jpeg' });
        const blob = await (0, background_removal_node_1.removeBackground)(before, this.config);
        const buffer = await blob.arrayBuffer();
        const format = this.config.output.format.split('/').pop();
        const fielPath = path.join(__dirname, 'out', file.originalname);
        await fs.mkdir(path.join(__dirname, '/out'), { recursive: true });
        await fs.writeFile(fielPath, Buffer.from(buffer));
        console.timeEnd();
        console.log(`Image saved to ${fielPath}`);
        return Buffer.from(buffer);
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)()
], AppService);
//# sourceMappingURL=app.service.js.map