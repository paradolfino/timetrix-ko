var Timetrix = Timetrix || {};

Timetrix.TaskModel = function(master, data)
{
    let self = this;
    self.Name = ko.observable(data.Name);
    self.Completed = typeof(data.Completed) == 'boolean' ? ko.observable(data.Completed) : ko.observable(false);
    self.Metrics = ko.observableArray(data.Metrics) || ko.observableArray([]);
    self.CompleteTask = function()
    {
        self.Completed(!self.Completed());
        for (let i = 0; i < self.Metrics().length; i++)
        {
            self.Metrics()[i].SaveLastValue();
        }
    }
};

Timetrix.MetricModel = function(master, data)
{
    let self = this;
    self.Name = ko.observable(data.Name);
    self.Description = ko.observable(data.Description);
    self.Value = data.Value || ko.observable(0);
    self.History = ko.observableArray([]);
    self.LastValue = ko.computed(function(){
        let last = self.History()[self.History().length - 1];
        return last;
    });

    self.Performance = ko.computed(function()
    {
        let perf;
        if (self.History()[self.History().length - 2] != undefined)
        {
            perf = self.History()[self.History().length - 1] - self.History()[self.History().length - 2];
        }
        else
        {
            perf = 0;
        }
        return perf;
    });

    self.PerformanceText = ko.computed(function()
    {
        let operator;
        if (self.Performance() >= 0)
        {
            operator = "+";
        }
        else
        {
            operator = "";
        }
        return "(" + operator + " " + self.Performance() + ")";
    });

    self.SaveLastValue = function()
    {
        self.History.push(self.Value());
    }

    self.SaveLastValue();
};

Timetrix.TimetrixModel = function()
{
    let self = this;
    self.Tasks = ko.observableArray([]);
    self.Metrics = ko.observableArray([]);
    self.TaskName = ko.observable("");
    self.TaskMetrics = ko.observableArray([]);
    self.TaskMetric = ko.observable("");
    self.MetricName = ko.observable("");
    self.MetricValue = ko.observable(10);
    self.MetricLastValue = ko.observable(0);
    self.MetricDescription = ko.observable("");

    self.AddTask = function()
    {
        self.Tasks.push(new Timetrix.TaskModel(self,{
            Name: self.TaskName(),
            Metrics: self.TaskMetrics()
        }));
    }

    self.AddTaskMetric = function()
    {
        self.TaskMetrics.push(self.TaskMetric());
    }

    self.AddMetric = function()
    {
        self.Metrics.push(new Timetrix.MetricModel(self,{
            Name: self.MetricName(),
            Value: self.MetricValue
        }));
    }

    
    
}

ko.applyBindings(new Timetrix.TimetrixModel(), document.getElementsByClassName("main")[0]);