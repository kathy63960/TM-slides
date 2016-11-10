NEWSCHEMA('DynPages').make(function (schema) {

    schema.define('id', 'String(20)');
    schema.define('title', 'String(100)', true);        // Meta title
    schema.define('sitemap', 'String(50)', true);
    schema.define('url', 'String(200)');
    schema.define('pageId', 'String(20)');
    schema.define('navigations', '[String]');           // In which navigation will be the page?
    schema.define('parent', 'String(20)');              // Parent page for breadcrumb
    schema.define('var1', 'String(200)');
    schema.define('var2', 'String(200)');
    schema.define('var3', 'String(200)');
    schema.define('var4', 'String(200)');

    // Saves the model into the database
    schema.setSave(function (error, model, options, callback) {
        model.id = UID();

        NOSQL('dynpages').insert(model.$clean());
        callback(SUCCESS(true));
        F.emit('dynpages.save', model);
    });
});