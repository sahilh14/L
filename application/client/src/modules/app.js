(function () {
  'use strict';

  angular
   .module('search.app')
   .controller('MainController', MainController)
   .service('DataService', DataService)
   .controller('HomeController', HomeController)
   .controller('VisualController', VisualController)
   .service('ConfigService', ConfigService)
   .controller('QueryController', QueryController)
   .service('APIService', APIService)

   DataService.$inject = ['$http', '$q', '$timeout', '$state']
   function DataService($http, $q, $timeout, $state) {

     var service = this;
     service.search_string = '';
     service.showVisual = true;

     service.setParam = function (value) {
       service.search_string = value;
     }
     service.getParam = function () {
       return service.search_string;
     }
     service.getData = function () {
       var response = [];
       if (!service.search_string || service.search_string.length == 0){
         $state.go('search', {}, {reload: true});
       }
       else {
         var response = $http({
           method: 'GET',
           url: 'basic/search_result',
           params: {search: service.search_string}
         })
       }
       return response;
     }

     service.setVisual = function (value) {
       service.showVisual = value;
     }
     service.getVisual = function () {
       return service.showVisual;
     }

   }

   function APIService() {
     this.positive = 0;
     this.negative = 0;
     this.neutral = 0;
     this.category = {};
     this.setSentimentData = function (value1, value2, value3) {
       this.positive = value1;
       this.negative = value2;
       this.neutral = value3;
     }
     this.getSentimentData = function () {
       return {
         pos: this.positive,
         neg: this.negative,
         neu: this.neutral
       };
     }
     this.setCategoryData = function (value) {
       this.category = value;
     }
     this.getCategoryData = function () {
       return this.category;
     }
   }

   function ConfigService() {
     var config = this;
     config.queryVisual = false;
     config.setVisual = function (value) {
       config.queryVisual = value;
     }
     config.getVisual = function () {
       return config.queryVisual;
     }

   }

   QueryController.$inject = ['APIService', 'DataService', '$state']
   function QueryController(APIService, DataService, $state) {
     var qctrl = this;
     if (!DataService.search_string || DataService.search_string.length == 0){
       $state.go('search', {}, {reload: true});
     }
     var sentimentData = APIService.getSentimentData();
     if (sentimentData.pos == 0 && sentimentData.neg == 0 && sentimentData.neu == 0 ){
       var nodata = {text: 'No Results', bold:true, fontSize:20}
       var series = [{values:[]}]
     } else {
       var series = [
         {
           'values':[sentimentData.pos],
           'text': 'Positive'
         },
         {
           "values":[sentimentData.neg],
           'text': 'Negative'
         },
         {
           "values": [sentimentData.neu],
           'text': 'Neutral'
          }
       ]
     }
     qctrl.sentiment = {
       "graphset": [{
         "type":"pie3d",
         "title":{
           "text":"Sentiment Analysis"
         },
         "noData": nodata,
         "series": series
       }]
     };

     var categoryData = APIService.getCategoryData();

     if (Object.keys(categoryData).length == 0) {
       var nodata = {text: 'No Results', bold:true, fontSize:20}
       var series = [{values:[]}]
     } else {
       var series = [
         {
           'values':[categoryData[0]],
           'text': 'Healthcare/Achievement/Address'
         },
         {
           "values":[categoryData[1]],
           'text': 'Power/Violence/Love'
         },
         {
           "values":[categoryData[2]],
           'text': 'President/Leader/Community'
          },
         {
           "values":[categoryData[3]],
           'text': 'Elections'
          },
         {
           "values":[categoryData[4]],
           'text': 'Youth/Life'
          },
         {
           "values":[categoryData[5]],
           'text': 'Climate/News'
         },
         {
           "values":[categoryData[6]],
           'text': 'Women Empowerment/Nation/Job/Debate'
         },
         {
           "values":[categoryData[7]],
           'text': 'Indian Politics'
          },
         {
           "values":[categoryData[8]],
           'text': 'Economy/History'
          },
         {
           "values":[categoryData[9]],
           'text': 'Campaign/Support/Gratitude'
         },
         {
           "values":[categoryData[10]],
           'text': 'Others'
         }
       ]
     }

     qctrl.category = {
       "graphset": [{
         "type":"pie3d",
         "title":{
           "text":"Topic Categorization"
         },
         "noData": nodata,
         "series": series
       }]
     };

   }


   VisualController.$inject = ['DataService', '$state'];
   function VisualController(DataService, $state) {
     var visual = this;
     if (DataService.getVisual() == true) {
       $state.go('search', {}, {reload: true});
     }
     visual.sent = false;
     visual.cat = false;
     visual.lang =false;
     visual.hash = false;
     visual.ctr = false;
     visual.ctr = false;

     visual.sentimentClicked = function () {
       visual.sent = true;
       visual.cat = false;
       visual.lang =false;
       visual.hash = false;
       visual.ctr = false;
        visual.myConfig = {
        type: "bar3d",
        series: [
        {
          values:[50,47,46,37,38,50,56,59,48,38,52,58,33,57,31]
        },
        {
          values:[7,11,14,13,11,8,11,14,5,19,15,12,16,10,20]  //negative
        },
        {
          values:[43,42,40,50,51,42,33,27,47,43,33,30,51,33,49] //positive
        }
        ]
        };
     }
     visual.categoryClicked = function () {
       visual.sent = false;
       visual.cat = true;
       visual.lang =false;
       visual.hash = false;
       visual.ctr = false;
       visual.pieChart = {
         "graphset": [{
           "type":"pie3d",
           "title":{
             "text":"Topic Categorization"
           },
           "series":[
             {
               'values':[14806],
               'text': 'Healthcare/Achievement/Address'
             },
             {
               "values":[6974],
               'text': 'Power/Violence/Love'
             },
             {
               "values":[10688],
               'text': 'President/Leader/Community'
              },
             {
               "values":[5558],
               'text': 'Elections'
              },
             {
               "values":[5886],
               'text': 'Youth/Life'
              },
             {
               "values":[3527],
               'text': 'Climate/News'
             },
             {
               "values":[3624],
               'text': 'Women Empowerment/Nation/Job/Debate'
             },
             {
               "values":[6501],
               'text': 'Indian Politics'
              },
             {
               "values":[3768],
               'text': 'Economy/History'
              },
             {
               "values":[4393],
               'text': 'Campaign/Support/Gratitude'
             }
           ]
         }]
      };
     }

     visual.languageclicked = function () {
       visual.sent = false;
       visual.cat = false;
       visual.lang =true;
       visual.hash = false;
       visual.ctr = false;
       visual.pieChartLang = {
         "graphset": [{
           "type":"pie3d",
           "title":{
             "text":"Language"
           },
           "series":[
             {
               'values':[20873],
               'text': 'Hindi'
             },
             {
               "values":[59688],
               'text': 'English'
             },
             {
               "values":[38703],
               'text': 'Portugese'
              },
             {
               "values":[7165],
               'text': 'Others'
              }
           ]
         }]
      };
     }

     visual.countryClicked = function () {
       visual.sent = false;
       visual.cat = false;
       visual.lang =false;
       visual.hash = false;
       visual.ctr = true;
       visual.pieChartCtr = {
         "graphset": [{
           "type":"pie3d",
           "title":{
             "text":"Country"
           },
           "series":[
             {
               'values':[31636],
               'text': 'India'
             },
             {
               "values":[35296],
               'text': 'USA'
             },
             {
               "values":[37315],
               'text': 'Brazil'
              },
             {
               "values":[22182],
               'text': 'Rest of the World'
              }
           ]
         }]
      };
     }

     visual.hashtagClicked = function () {
       visual.sent = false;
       visual.cat = false;
       visual.lang =false;
       visual.hash = true;
       visual.ctr = false;
       visual.hashCloud = {
         type: 'wordcloud',
         options: {
           words: [
            {
              text: "kellyfile",
              count: 713
            },
            {
              text: "caldeirão",
              count: 657
            },
            {
              text: "elizabethwarren",
              count: 580
            },
            {
              text: "ac360",
              count: 482
            },
            {
              text: "donaldtrump",
              count: 460
            },
            {
              text: "jairbolsonaro",
              count: 453
            },
            {
              text: "joebiden",
              count: 444
            },
            {
              text: "aovivo",
              count: 427
            },
            {
              text: "narendramodi",
              count: 427
            },
            {
              text: "tulsigabbard",
              count: 402
            },
            {
              text: "arvindkejriwal",
              count: 362
            },
            {
              text: "adcomunicação",
              count: 342
            },
            {
              text: "shashitharoor",
              count: 336
            },
            {
              text: "kamalaharris",
              count: 313
            },
            {
              text: "yogiadityanath",
              count: 313
            },
            {
              text: "mtp",
              count: 283
            },
            {
              text: "actonclimate",
              count: 275
            },
            {
              text: "settleformore",
              count: 254
            },
            {
              text: "tulsi2020",
              count: 229
            },
            {
              text: "epstein",
              count: 208
            },
            {
              text: "bjp",
              count: 182
            },
            {
              text: "pelademocracia",
              count: 165
            },
            {
              text: "depheliolopes",
              count: 154
            },
            {
              text: "minhacoréobrasil",
              count: 152
            },
            {
              text: "issoaglobonãomostra",
              count: 151
            },
            {
              text: "doyourjob",
              count: 150
            },
            {
              text: "sotu",
              count: 150
            },
            {
              text: "alvarodias",
              count: 140
            },
            {
              text: "trump",
              count: 138
            },
            {
              text: "debatenight",
              count: 136
            }
          ],
      aspect: 'spiral',

      colorType: 'palette',
      palette: ['#D32F2F','#5D4037','#1976D2','#E53935','#6D4C41','#1E88E5','#F44336','#795548','#2196F3','#EF5350','#8D6E63','#42A5F5'],

      style: {
        fontFamily: 'Crete Round',

      hoverState: {
        backgroundColor: '#D3D3D3',
        borderRadius: 2,
        fontColor: 'black'
      },
      tooltip: {
        text: '%text: %hits',
        visible: true,
        alpha: 0.9,
        backgroundColor: '#1976D2',
        borderRadius: 2,
        borderColor: 'none',
        fontColor: 'white',
        fontFamily: 'Georgia',
        textAlpha: 1
      }
    }
  }
};
     }

   }

  MainController.$inject = ['$state', 'DataService', 'ConfigService']
  function MainController($state, DataService, ConfigService) {
    var ctrl = this;
    ctrl.hide_search = false;
    ctrl.showQueryVisual = false;
    ctrl.showVisual = true;
    ctrl.search = function () {
      if (!ctrl.search_string || ctrl.search_string.length == 0){
        $state.go('search', {}, {reload: true});
      } else {
        DataService.setParam(ctrl.search_string);
        ConfigService.setVisual(true);
        ctrl.showQueryVisual = true;
        ctrl.showVisual = false;
        $state.go('home', {}, {reload: true});
      }
    }
    ctrl.clicked = function () {
      ctrl.showQueryVisual = false;
      ctrl.hide_search = true;
      ctrl.showVisual = false;
      DataService.setVisual(false);
    }
    ctrl.clearData = function () {
      ctrl.search_string = null;
      ctrl.hide_search = false;
      ctrl.showQueryVisual = false;
      ctrl.showVisual = true;
      DataService.setVisual(true);
    }

  }

  HomeController.$inject = ['searchData', '$http', '$interval', '$scope', 'DataService', '$state', 'APIService']
  function HomeController(searchData, $http, $interval, $scope, DataService, $state, APIService) {

    var home = this;
    var begin = 0;
    var end = 0;
    var positive = 0;
    var negative = 0;
    var topic;
    var category = {0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0};
    var search_string = DataService.getParam();
    if (!search_string || search_string.length == 0){
      home.show_str = false;
      $state.go('search');
    } else {
      home.show_str = true;
    }
    home.count = 1;
    home.searchData = searchData.data;
    home.currentpage = 1;
    home.itemsperpage = 10;
    home.maxsize = 10;
    home.showPagination = true;
    home.showNoData = false;

    for (var data in home.searchData) {
      home.searchData[data].url = "https://twitter.com/" + home.searchData[data].name + "/status/" + home.searchData[data].id;
      home.searchData[data].open = false;
      if (home.searchData[data].tweet_sentiment == "positive") {
        positive += 1;
      }
      if (home.searchData[data].tweet_sentiment == "negative") {
        negative += 1;
      }

      topic = home.searchData[data].topic;
      category[topic[0]] += 1
    }
    home.actualData = home.searchData;

    if (home.searchData && home.searchData.length > 0) {
      home.noofpages = home.searchData.length / home.itemsperpage;
      APIService.setSentimentData(positive, negative, home.searchData.length - positive - negative);
      APIService.setCategoryData(category);
    } else {
      home.noofpages = 0;
      home.showPagination = false;
      home.showNoData = true;
      home.show_str = false;
      APIService.setSentimentData(0, 0, 0);
      APIService.setCategoryData({});
    }

    $scope.$watch('home.currentpage', function () {
      begin = (home.currentpage - 1) * home.itemsperpage;
      end = begin + home.itemsperpage;

      home.paged = {results: home.searchData.slice(begin, end)}

    });

    home.clearCountryList = function () {
      home.selected.country = [];
      home.paged.results = [];
      home.searchData = home.actualData;
      home.currentpage = 1;
      begin = (home.currentpage - 1) * home.itemsperpage;
      end = begin + home.itemsperpage;

      home.paged = {results: home.searchData.slice(begin, end)}
    }

    home.clearLanguageList = function () {
      home.selected.language = [];
      home.paged.results = [];
      home.searchData = home.actualData;
      home.currentpage = 1;
      begin = (home.currentpage - 1) * home.itemsperpage;
      end = begin + home.itemsperpage;

      home.paged = {results: home.searchData.slice(begin, end)}
    }

    home.applyCountryFilter = function () {
      var country_list = [];
      home.searchData = [];
      home.paged.results = [];
      for (var i in home.selected.country) {
        country_list.push(home.selected.country[i].name);
      }
      for (var i in home.actualData) {
        if (country_list.indexOf(home.actualData[i].country[0]) >= 0) {
          home.searchData.push(home.actualData[i]);
        }
      }
      home.currentpage = 1;
      begin = (home.currentpage - 1) * home.itemsperpage;
      end = begin + home.itemsperpage;

      home.paged = {results: home.searchData.slice(begin, end)}

    }

    home.applyLanguageFilter = function () {
      var language_list = [];
      home.searchData = [];
      home.paged.results = [];
      for (var i in home.selected.language) {
        language_list.push(home.selected.language[i].value);
      }
      for (var i in home.actualData) {
        if (language_list.indexOf(home.actualData[i].language) >= 0) {
          home.searchData.push(home.actualData[i]);
        }
      }
      home.currentpage = 1;
      begin = (home.currentpage - 1) * home.itemsperpage;
      end = begin + home.itemsperpage;

      home.paged = {results: home.searchData.slice(begin, end)}
    }

    home.applyFilter = function () {
      var language_list = [];
      var country_list = [];
      home.searchData_lang = [];
      home.searchData_country = [];
      home.searchData_verified = [];
      home.paged.results = [];

      if (home.selected.language.length > 0) {
        for (var i in home.selected.language) {
          language_list.push(home.selected.language[i].value);
        }
        for (var i in home.actualData) {
          if (language_list.indexOf(home.actualData[i].language) >= 0) {
            home.searchData_lang.push(home.actualData[i]);
          }
        }
      }
      else{
        home.searchData_lang = home.actualData
      }

      if (home.selected.country.length > 0) {
        for (var i in home.selected.country) {
          country_list.push(home.selected.country[i].name);
        }
        for (var i in home.searchData_lang) {
          if (country_list.indexOf(home.searchData_lang[i].country[0]) >= 0) {
            home.searchData_country.push(home.searchData_lang[i]);
          }
        }
      }
      else {
        home.searchData_country = home.searchData_lang
      }

      if (home.selected.verified.length > 0){
        for (var i in home.searchData_country) {
          if (home.searchData_country[i].verified) {
            home.searchData_verified.push(home.searchData_country[i]);
          }
        }
      }
      else {
        home.searchData_verified = home.searchData_country
      }

      home.searchData = home.searchData_verified;
      home.currentpage = 1;
      begin = (home.currentpage - 1) * home.itemsperpage;
      end = begin + home.itemsperpage;

      home.paged = {results: home.searchData.slice(begin, end)}
    }

    home.clearFilter = function () {
      home.selected.language = [];
      home.selected.country = [];
      home.selected.verified = [];
      home.paged.results = [];
      home.searchData = home.actualData;
      home.currentpage = 1;
      begin = (home.currentpage - 1) * home.itemsperpage;
      end = begin + home.itemsperpage;

      home.paged = {results: home.searchData.slice(begin, end)}
    }

    home.countrylist = [
         {name: 'India'},
         {name: 'USA'},
         {name: 'Brazil'}
    ];

    home.selected = {
        country: [],
        language: [],
        verified: []
    };
    home.languagelist = [
         {name: 'English', value:'en'},
         {name: 'Hindi', value:'hi'},
         {name: 'Portugese', value:'pt'}
    ];

  }

})();
