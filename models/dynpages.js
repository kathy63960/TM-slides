NEWSCHEMA('Dynpage').make(function (schema) {

    schema.define('id', 'String(20)');
    schema.define('title', 'String(100)', true);        // Meta title
    schema.define('sitemap', 'String(50)', true);
    schema.define('url', 'String(200)');
    schema.define('pageId', 'String(20)');
    schema.define('navigations', 'String');           // In which navigation will be the page?
    schema.define('keywords', 'String(200)');           // Meta keywords
    schema.define('parent', 'String(20)');              // Parent page for breadcrumb
    schema.define('language', 'Lower(2)');              // For which language is the page targeted?
    schema.define('var', '[String(200)]');

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

    // Gets a specific post
    schema.setGet(function (error, model, options, callback) {

        if (options.category)
            options.category = options.category.slug();

        var filter = NOSQL('dynpages').one();

        console.log(options);
        //options.category && filter.where('category_linker', options.category);
        options.linker && filter.where('linker', options.linker);
        options.id && filter.where('id', options.id);
        options.language && filter.where('language', options.language);
        options.template && filter.where('template', options.template);

        filter.callback(function (item) {
            return console.log(item);
            //callback
        }, 'error-404-post');
    });

    // Removes a specific page
    schema.setRemove(function (error, id, callback) {
        var db = NOSQL('dynpages');
        db.remove().where('id', id).callback(callback);
        db.counter.remove(id);
    });

    // Saves the model into the database
    schema.setSave(function (error, model, options, callback) {

        var newbie = model.id ? false : true;
        var nosql = NOSQL('dynpages');

        if (newbie)
            model.id = UID();

        // control url format
        var arr = model.url.split('/');

        arr = arr.filter(String);

        var url = "";
        if (model.language && arr[0] !== model.language)
            url += "/" + model.language;

        if (arr[0] == 'pages')
            arr.shift(); //suppress first element;

        if (arr[1] == 'pages') {
            arr.shift(); //suppress 2 first elements
            arr.shift();
        }

        url += '/pages';

        if (!arr.length)
            url += '/' + model.sitemap;
        else
            for (var i = 0; i < arr.length; i++)
                url += "/" + arr[i];

        url += '/';

        model.url = url;

        (newbie ? nosql.insert(model.$clean()) : nosql.modify(model).where('id', model.id));
        callback(model);
        F.emit('dynpages.save', model);
    });
});