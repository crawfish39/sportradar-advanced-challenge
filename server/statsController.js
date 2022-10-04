const statsController = {};

statsController.getGameStats = async (req,res,next) => {
    const { gameURL } = req.body;
    try {
        if (!gameURL ) return res.status(400).json({ 'message': 'Missing gameURL from submission' });
        const response = await fetch(`https://statsapi.web.nhl.com` + gameURL, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        res.locals.stats = await response.json();
        return next();
    } catch (err) {
        console.log('getGameStats: ERROR: ', err)
    }
    next();
}

export { statsController }