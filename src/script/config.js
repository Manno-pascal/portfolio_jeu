export const config = {
    xRotationSensibility: 0.005,
    isUserPhone: false,
    cameraHeight: 0.05,
    moveSpeed: 0.15,
    resolutionRatio: 1.0,
    waterResolution: 100,
    waterReflection: 1.0,
    maxFPS: 60,
    currentGraphics: 'low',
    graphics: {
        potato: {
            resolutionRatio: 0.5,
            waterResolution: 1,
            waterReflection: 0.0,
            maxFPS: 30,
        },
        low: {
            resolutionRatio: 0.64,
            waterResolution: 100,
            waterReflection: 0.25,
            maxFPS: 30,
        },
        medium: {
            resolutionRatio: 0.76,
            waterResolution: 164,
            waterReflection: 0.5,
            maxFPS: 60,
        },
        high: {
            resolutionRatio: 1.0,
            waterResolution: 256,
            waterReflection: 1.0,
            maxFPS: 60,
        },
    },
    updateLoadingBar: function (percent) {
        document.querySelector('#loadingBar').style.width = `${percent}%`;
    }
};