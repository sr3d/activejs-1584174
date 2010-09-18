(function(){

/**
 * Adapter for Titanium.Database interface, which is a wrapper on top of SQLite
 * @alias ActiveRecord.Adapters.Titanium
 * @property {ActiveRecord.Adapter}
 */
ActiveRecord.Adapters.Titanium = function Titanium(db){
    this.db = db;
    ActiveSupport.extend(this,ActiveRecord.Adapters.InstanceMethods);
    ActiveSupport.extend(this,ActiveRecord.Adapters.SQLite);
    ActiveSupport.extend(this,{
        executeSQL: function executeSQL(sql)
        {
          var args = ActiveSupport.arrayFrom(arguments);
          ActiveRecord.connection.log("Adapters.Titanium: " + sql + " [" + args.slice(1).join(',') + "]");
          
          var response;
          if( args.length == 1 ) { 
            response = ActiveRecord.connection.db.execute(sql);
          } else {
            args = args.slice(1);
            var params= [];
            for( var i = 0; i < args.length; i++ ) { 
              if( typeof(args[i]) != 'undefined' )
                params.push('args[' + i + ']');
              else
                params.push("''");
            }
            var statement = 'response = ActiveRecord.connection.db.execute(sql,' + params.join(',') + ')';
            // ActiveRecord.connection.log('Eval Statement: ' + statement);
            eval( statement );
          }
          return response;
        },
        getLastInsertedRowId: function getLastInsertedRowId()
        {
            return this.db.lastInsertRowId;
        },
        iterableFromResultSet: function iterableFromResultSet(result)
        {
            var response = {
                rows: []
            };
            var count = result.fieldCount();
            var fieldNames = [];
            for(var i = 0; i < count; ++i)
            {
                fieldNames[i] = result.fieldName(i);
            }
            while(result.isValidRow())
            {
                var row = {};
                for(var i = 0; i < count; ++i)
                {
                    row[fieldNames[i]] = result.field(i);
                }
                response.rows.push(row);
                result.next();
            }
            result.close();
            response.iterate = ActiveRecord.Adapters.defaultResultSetIterator;
            return response;
        },
        fieldListFromTable: function(table_name)
        {
            var response = {};
            var description = ActiveRecord.connection.iterableFromResultSet(ActiveRecord.connection.executeSQL('SELECT * FROM sqlite_master WHERE tbl_name = "' + table_name + '"')).iterate(0);
            var columns = description.sql.match(new RegExp('CREATE[\s]+TABLE[\s]+' + table_name + '[\s]+(\([^\)]+)'));
            var parts = columns.split(',');
            for(var i = 0; i < parts.length; ++i)
            {
                //second half of the statement should instead return the type that it is
                response[parts[i].replace(/(^\s+|\s+$)/g,'')] = parts[i].replace(/^\w+\s?/,'');
            }
            return response;
        }
    });
};

ActiveRecord.Adapters.Titanium.connect = function connect(name)
{
  if(!name) {name = 'app';};
  var db = Titanium.Database.open(name + '.sqlite');
  return new ActiveRecord.Adapters.Titanium(db);
};

})();
