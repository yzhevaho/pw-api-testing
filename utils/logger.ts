
export class APILogger {
    private recentLogs: any[] = []

    logRequest(method: string, url: string, headers: Record<string, string>, body?: any) {// why body type is any?
        const logEntry = { method, url, headers, body }
        this.recentLogs.push({type: 'Request Details', data: logEntry})// what does this method do? 
    }

    logResponse(statusCode: number, body?: any) {// why body type is any?
        const logEntry = { statusCode, body }
        this.recentLogs.push({type: 'Response Details', data: logEntry})// what does this method do? 
    }

    getRecentLogs(){
        const logs = this.recentLogs.map(log => { // didn't get at all
            return `===${log.type}===\n${JSON.stringify(log.data, null, 4)}` //as well

        }).join('\n\n')
        return logs
    }
}