var gTaskBackgroundColor = {};

function getBackgroundColorForTask(task)
{
	var level = task.getLevel();
	if (typeof(gTaskBackgroundColor[level]) === "undefined")
	{
		gTaskBackgroundColor[level] = "#0dceb0";
		if (level > 0)
			gTaskBackgroundColor[level - 1] = getRandomColor();
	}
	return gTaskBackgroundColor[level];

}

function toCalendarDateFormat(date)
{
	//var result = date.toISOString();
	//return result.substr(0, 10);

	var result = date.getFullYear().toString() + '-';
	var month = (date.getMonth() + 1).toString();
	if (month.length === 1)
		result += '0';
	result += month + '-';
	var d = date.getDate().toString();
	if (d.length === 1)
		result += '0';
	result += d ;

	return result;

}

function getTaskEstimatedStartDate(task)
{
	if (task !== null && (task instanceof Task))
	{
		var tmp = task.getEstimate();
		tmp = tmp * 3600000;
		var dueDate = task.getDueDate();
		var day = dueDate.getDay();
		var gap = 0;

		while (tmp > 0)
		{
			day--;
			day = (day === -1) ? 6 : day;
			var businessHours = task.getBusinessHours(day);
			if (businessHours)
			{
				var s = moment.duration(businessHours.getStartTime());
				var e = moment.duration(businessHours.getEndTime());
				var t = e.subtract(s);
				tmp -= t._milliseconds;
			}
			
			gap++;
		}



		var t = dueDate.getTime() - gap * 24 * 3600000;
		var d = new Date(t);
		return toCalendarDateFormat(d);
	}
	return "";
}


function prepareProjectCalendarData(task, data)
{
	if (task !== null && (task instanceof Task))
	{
		getBackgroundColorForTask(task);

		var subtasks = task.getSubtasks();
		for (var i = 0; i < subtasks.length; i++)
		{
			var subtask = TASKS[subtasks[i]];
			if (subtask !== null && (subtask instanceof Task))
			{
				prepareProjectCalendarData(subtask, data);
			}
		}

		var e = toCalendarDateFormat(task.getDueDate());
		var s = getTaskEstimatedStartDate(task);
		data.push({
			backgroundColor: getBackgroundColorForTask(task),
			borderColor: getBackgroundColorForTask(task),
			id: task.id(),
			title: task.getCaption(),
			start: s,
			end: e,
			durationEditable: false,
			startEditable: false,
			editable: false,
			className: task.id()
		});
	}
}

function extractProjectCalendarData(project)
{
	var result = [];
	for (var i = 0; i < 7; i++)
	{
		var bh = project.getBusinessHours(i);
		if (bh !== null)
		{
			result.push(
				{
					dow : [i],
					start : bh.getStartTime(),
					end : bh.getEndTime()
				}
			);
		}
	}

	return result;
}



function buildProjectCalendar(project)
{

	fadeDrawer("out", animationDuration);

	var html = "<div id='project-calendar'></div>";

	$('#top-shelf').html(html);
	$('#breadcrumb').html('<h3>Project Calendar</h3>');

	var data = [];
	prepareProjectCalendarData(project, data);

	setTimeout(
		function()
		{
			$('#project-calendar').fullCalendar({
				header: {
					left: 'prev,next today',
					center: 'title',
					right: 'month,agendaWeek,agendaDay,listWeek'
				},
				businessHours: extractProjectCalendarData(project),
				eventBackgroundColor : "#0dceb0",
				eventBorderColor : "#1ddec0",
				navLinks: true, // can click day/week names to navigate views
				editable: false,
				eventLimit: true, // allow "more" link when too many events
				events: data,
				nowIndicator: true
			});
		}
		,
		5
	);


}