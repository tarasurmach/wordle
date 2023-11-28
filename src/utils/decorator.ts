export function autoBind(_:any, _2:string, descriptor:PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const adjustedDescriptor:PropertyDescriptor = {
        configurable:true,
        get() {
            return originalMethod.bind(this);
        },
    }
    return adjustedDescriptor;
}

function required(target:any, key:string) {
    let currentPropValue = target[key];
    Object.defineProperty(target, key, {
        set: (newValue:typeof currentPropValue) => {
            if(!newValue) {
                throw new Error(`${key} is required.`)
            }
            currentPropValue = newValue
        },
        get: (): typeof currentPropValue =>{
            return currentPropValue
        }
    })

}