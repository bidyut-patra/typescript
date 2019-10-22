import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class ModelDataProvider {
    constructor(private http: Http) {}

    public getBlocks() {
        const blocksObs = this.http.get('assets/graphics-data/blocks.json');
        return blocksObs;
    }

    public getConnections() {
        const connectionsObs = this.http.get('assets/graphics-data/connections.json');
        return connectionsObs;
    }

    public getModel(blockType: string, x: number, y: number) {
        let modelData;
        switch (blockType) {
            case '2ioblock':
                modelData = this.getIOBlockModelData(blockType, x, y);
                break;
            case '3ioblock':
                modelData = this.getIOBlockModelData(blockType, x, y);
                break;
            case 'process':
                modelData = this.getProcessData(blockType, x, y);
                break;
            case 'decision':
                modelData = this.getDecisionData(blockType, x, y);
                break;
            default:
                break;
        }
        return modelData;
    }

    private getIOBlockModelData(blockType: string, x: number, y: number) {
        const content = [];
        const ioCounts = (blockType === '2ioblock') ? 2 : (blockType === '3ioblock' ? 3 : 0);
        if (ioCounts > 0) {
            let yFactor = 0;
            for (let i = 1; i <= ioCounts; i++) {
                content.push({
                    label: 'Input Output' + i,
                    type: 'member',
                    direction: 'InOut',
                    leftPort: {
                        id: 'lp' + i,
                        xOffset: 12,
                        yOffset: 64.5 + yFactor
                    },
                    rightPort: {
                        id: 'rp' + i,
                        xOffset: 212,
                        yOffset: 64.5 + yFactor
                    }
                });
                yFactor += 43;
            }
        }

        return {
            type: blockType,
            marginLeft: x,
            marginTop: y,
            header: blockType,
            content: content
        };
    }

    private getProcessData(blockType: string, x: number, y: number) {
        return {
            type: blockType,
            marginLeft: x,
            marginTop: y,
            header: blockType,
            content: [
                {
                    label: 'Input1',
                    type: 'pin',
                    direction: 'TopIn',
                    port: {
                        id: 'in1',
                        xOffset: 108,
                        yOffset: -5
                    }
                },
                {
                    label: 'Input2',
                    type: 'pin',
                    direction: 'LeftIn',
                    port: {
                        id: 'in2',
                        xOffset: 12,
                        yOffset: 80
                    }
                },
                {
                    label: 'Output1',
                    type: 'pin',
                    direction: 'RightOut',
                    port: {
                        id: 'op1',
                        xOffset: 215,
                        yOffset: 80
                    }
                },
                {
                    label: 'Output2',
                    type: 'pin',
                    direction: 'BottomOut',
                    port: {
                        id: 'op2',
                        xOffset: 105,
                        yOffset: 120
                    }
                }
            ]
        };
    }

    private getDecisionData(blockType: string, x: number, y: number) {
        return {
            type: blockType,
            marginLeft: x,
            marginTop: y,
            header: blockType,
            content: [
                {
                    label: 'Input1',
                    type: 'pin',
                    direction: 'TopIn',
                    port: {
                        id: 'in1',
                        xOffset: 60,
                        yOffset: -20
                    }
                },
                {
                    label: 'Input2',
                    type: 'pin',
                    direction: 'LeftIn',
                    port: {
                        id: 'in2',
                        xOffset: -5,
                        yOffset: 46.5
                    }
                },
                {
                    label: 'Output1',
                    type: 'pin',
                    direction: 'BottomOut',
                    port: {
                        id: 'op1',
                        xOffset: 65,
                        yOffset: 115
                    }
                },
                {
                    label: 'Output2',
                    type: 'pin',
                    direction: 'RightOut',
                    port: {
                        id: 'op2',
                        xOffset: 128,
                        yOffset: 45
                    }
                }
            ]
        };
    }
}
