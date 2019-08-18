class DragEventInfo {
    private eventData: any[];

    setData(data: any) {
        this.eventData.push(data);
    }

    getData(): any[] {
        return this.eventData;
    }
}

export const DragEventData = new DragEventInfo();