const getSurgeMultiplier = async () => {
    let multiplier = 1

    const hour = new Date().getHours()
    const busyHours = [5, 6, 7, 8, 17, 18, 19] // Example busy hours
    if (busyHours.includes(hour)) {
        multiplier += 0.5 // 50% surge during busy hours
    }

    const isRaining = await checkWeatherCondition() // External weather check
    if (isRaining) {
        multiplier += 0.3 // 30% surge during rain
    }

    return multiplier
}

module.exports = getSurgeMultiplier
