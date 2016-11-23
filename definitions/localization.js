var allowed = { fr: true, en: true };

F.onLocale = function(req, res) {

    var language = req.query.language;

    // Set the language according to the querystring and store to the cookie
    if (language) {
        if (!allowed[language])
            return 'fr';

        return language;
    }

    language = req.path[0];
    
    if (language) {
        if (allowed[language])
            return language;
    }

    // Sets the language according to user-agent
    //language = req.language;

    //if (language.indexOf('en') > -1)
    //    return 'en';
    
    return '';
};
