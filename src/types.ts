export enum PortVisibility {
    PRIVATE = 0,
    PUBLIC = 1,
}

export enum OnPortExposedAction {
    IGNORE = 0,
    OPEN_BROWSER = 1,
    OPEN_PREVIEW = 2,
    NOTIFY = 3,
    NOTIFY_PRIVATE = 4,
}
export enum PortAutoExposure {
    TRYING = 0,
    SUCCEEDED = 1,
    FAILED = 2,
}

export enum TunnelVisiblity {
    NONE = 0,
    HOST = 1,
    NETWORK = 2,
}

export interface PortsStatus {
    localPort: number,
    served: boolean,
    exposed?: {
        visibility: PortVisibility,
        url: string,
        onExposed: OnPortExposedAction,
    },
    autoExposure: PortAutoExposure,
    tunneled?: {
        targetPort: number,
        visibility: TunnelVisiblity,

        clientsMap: Array<[string, number]>,
    },
    description: string,
    name: string,
}