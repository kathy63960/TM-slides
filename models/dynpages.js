NEWSCHEMA('Dynpage').make(function (schema) {

    schema.define('id', 'String(20)');
    schema.define('title', 'String(100)', true);        // Meta title
    schema.define('sitemap', 'String(50)', true);
    schema.define('url', 'String(200)');
    schema.define('pageId', 'String(20)');
    schema.define('navigations', 'String');           // In which navigation will be the page?
    schema.define('parent', 'String(20)');              // Parent page for breadcrumb
    schema.define('var1', 'String(200)');
    schema.define('var2', 'String(200)');
    schema.define('var3', 'String(200)');
    schema.define('var4', 'String(200)');

    // Gets listing
    schema.setQuery(function (error, options, callback) {

        //options.page = U.parseInt(options.page) - 1;
        //options.max = U.parseInt(options.max, 20);

        //if (options.page < 0)
        //    options.page = 0;

        //var take = U.parseInt(options.max);
        //var skip = U.parseInt(options.page * options.max);
        var filter = NOSQL('dynpages').find();

        //if (options.category)
        //    options.category = options.category.slug();

        //options.language && filter.where('language', options.language);
        //options.category && filter.where('category_linker', options.category);
        //options.search && filter.like('search', options.search.keywords(true, true));

        //filter.take(take);
        //filter.skip(skip);
        //filter.fields('id', 'category', 'name', 'language', 'datecreated', 'linker', 'category_linker', 'pictures', 'perex', 'tags');
        filter.sort('sitemap');

        filter.callback(function (err, docs, count) {
            console.log(docs);
            var data = {};
            data.count = count;
            data.items = docs;
            //data.limit = options.max;
            //data.pages = Math.ceil(data.count / options.max) || 1;
            //data.page = options.page + 1;

            callback(data);
        });
    });

    // Saves the model into the database
    schema.setSave(function (error, model, options, callback) {

        var newbie = model.id ? false : true;
        var nosql = NOSQL('dynpages');

        if (newbie)
            model.id = UID();

        (newbie ? nosql.insert(model.$clean()) : nosql.modify(model).where('id', model.id));
        callback(model);
        F.emit('dynpages.save', model);
    });
});