"use strict";

var isDrawerVisible = false;
var scrollAmount = 0;


var lastClickedObject = null;
var animationDuration = 800;

var gCurrentTask = null;


var projectHTML = `
<div class="task-card dontsplit" id="{0}">
	<div class="card-pin"></div>
	<div class="card-title">
		<div class="card-user-role">{11}</div>
		<h2>{1}</h2>
		<div class="btn-edit-task" data-source="{0}"></div>
	</div>
	<div class="card-content">
		{7}
		<div class="task-description">
		{2}
		</div>
		<div class="team-member-container">
		{3}
		</div>

		
	</div>
	<div class="card-footer">
		<div class="circular-progress">{5}</div>
		<div class="circular-progress">{6}</div>

		<div class="story-points"><h4>achieved: {8}     workload: {9}     remaining: {10}</h4></div>
		<div class="card-bottom-btn-container">
			<div class="btn-expand-card" data-source="{0}">
			</div>
			
			<div>
				 {4} subtasks
			</div>

			<div class="btn-create-task" data-source="{0}">
			</div>

			<div>
				add subtask
			</div>


		</div>
	</div>
</div>`;


var taskHTML = `
<div class="task-card dontsplit" id="{0}">
	<div class="card-pin"></div>
	<div class="card-title">
		{11}
		<h2>{1}</h2>
		<div class="btn-edit-task" data-source="{0}"></div>
	</div>
	<div class="card-content">
		{7}
		<div class="task-description">
		{2}
		</div>
		<div class="tag-container">
		{3}
		</div>

		
	</div>
	<div class="card-footer">
		<div class="circular-progress">{5}</div>
		<div class="circular-progress">{6}</div>

		<div class="story-points"><h4>achieved: {8}     workload: {9}     remaining: {10}</h4></div>
		<div class="card-bottom-btn-container">
			<div class="btn-expand-card" data-source="{0}">
			</div>
			
			<div>
				 {4} subtasks
			</div>

			<div class="btn-create-task" data-source="{0}">
			</div>

			<div>
				add subtask
			</div>

		</div>
	</div>
</div>`;



var progressionGraph = null;
var progressionGraphHTML = `
<div class="task-card dontsplit" id="progression-graph-card">
	<div class="card-pin"></div>
	<div class="card-title"><h2>Progression graph</h2></div>
	<div class="card-content" id="progression-graph">
		
	</div>
	<div class="card-footer">
		
	</div>
</div>`;


var workloadPieChart = null;
var workloadPieChartHTML = `
<div class="task-card dontsplit" id="workload-pie-chart-card">
	<div class="card-pin"></div>
	<div class="card-title"><h2>Workload Distribution</h2></div>
	<div class="card-content" id="workload-pie-chart">
		
	</div>
	<div class="card-footer">
		
	</div>
</div>`;

var progressionPieChart = null;
var progressionPieChartHTML = `
<div class="task-card dontsplit" id="progression-pie-chart-card">
	<div class="card-pin"></div>
	<div class="card-title"><h2>Total Progression</h2></div>
	<div class="card-content" id="progression-pie-chart">
		
	</div>
	<div class="card-footer">
		
	</div>
</div>`;


var burndownChart = null;
var burndownChartHTML = `
<div class="task-card dontsplit" id="burndown-chart-card">
	<div class="card-pin"></div>
	<div class="card-title"><h2>Burndown Chart</h2></div>
	<div class="card-content" id="burndown-chart">
		
	</div>
	<div class="card-footer">
		
	</div>
</div>`;


var velocityChart = null;
var velocityChartHTML = `
<div class="task-card dontsplit" id="velocity-chart-card">
	<div class="card-pin"></div>
	<div class="card-title"><h2>Velocity Chart</h2></div>
	<div id="velocity-interval-combo-container">Interval:
		<select id="velocity-interval-combo">
			<option value="1">Day</option>
			<option value="7">Week</option>
			<option value="14" selected>2 Weeks</option>
			<option value="21">3 Weeks</option>
			<option value="28">4 Weeks</option>
		</select> 
	</div>
	<div class="card-content" id="velocity-chart">
		
	</div>
	<div class="card-footer">
		
	</div>
</div>`;



var chartCardHTML = `
<div class="task-card dontsplit" id="{0}-card">
	<div class="card-pin"></div>
	<div class="card-title"><h2>{1}</h2></div>
	<div class="card-content" id="{0}">
		
	</div>
	<div class="card-footer">
		
	</div>
</div>`;




var userCardHTML = `
<div class="user-card dontsplit" id="{0}-card">
	<div class="card-pin"></div>
	<div class="card-title"><img src="{4}" alt="{1}" class="user-avatar"><div class="user-id"><h3 class="block-layout">{1} <div class="btn-edit-user" data-source="{0}"></div></h3> <div class="card-user-role block-layout">({2})</div></div></div>
	<div class="card-content" id="{0}">
		<div class="user-description">
			{3}
		</div>
	</div>
	<div class="card-footer">
		
		<div class="assigned-tasks-container">
		<h3>Assigned tasks</h3><br/>
		{5}
		</div>
	</div>
</div>`;


function containerWidth()
{
	return $(window).width() -30;
}

function centerModalDialog()
{
  $('.modal.fade.in > .modal-dialog').css("opacity", "0");
  $('.modal.fade.in > .modal-dialog').css("margin-left", "-350px");
  var hmargin = Math.floor(($(window).width() - $('.modal.fade.in > .modal-dialog > .modal-content').width()) / 2);
  hmargin = (hmargin < 0) ? 0 : hmargin;
  $('.modal.fade.in > .modal-dialog').animate({ left : "0px", marginLeft:  hmargin.toString() + "px", opacity : "1"}, 500); 
}



function generateTagsHTML(task)
{
	var result = "";

	if (!(task instanceof Project))
	{
		var tags = task.getTags();
		
		for (var i = 0; i < tags.length; i++)
		{
			var tag = TAGS[task._projectId + toSingleWord(tags[i])];
			if (tag !== null && (tag instanceof Tag))
			{
				var tmp = '<div class="card-tag"><div class="card-tag-caption" data-source="{0}">{1}</div></div>';
				result += String.format(tmp, tag.id(), tag.getCaption());
			}
		}
		result += String.format('<div class="btn-edit-tags" data-source="{0}"></div>', task.id());
	}
	return result;
}

function buildBreadCrumbHTML(task)
{
	var html = "";

	var tmp = task;
	while (tmp !== null && typeof(tmp) !== "undefined")
	{
		var caption = tmp.getCaption();
		var taskId = tmp.id();
		html = String.format('<div class="crumb" data-source="{1}"> » {0}</div>', caption, taskId) + html;
		tmp = tmp.getParent();
	}
	
	return html;
}

function userSmallAvatarHTML(user, taskId)
{
	var html = String.format('<div class="avatar-container"><img src="{0}" alt="{1}" class="user-small-avatar" data-source="{2}"><div class="btn-remove-user" data-userid="{2}" data-taskid="{3}">&times</div></div>', user.getAvatarUrl(), user.getName(), user.id(), taskId);
	return html;
}


function generateTaskHTML(task)
{
	if (task !== null && (task instanceof Task))
	{
		var elapsed = percentageAsString(task.getConsumed(), task.getEstimate());
		var workload = Math.floor(task.getWorkload() + 0.5);
		var achieved = percentageAsString(task.getProgression(), workload);

		var numAchieved = Math.floor(task.getProgression() + 0.5);

		var description_html_content = markdown.toHTML( task.getDescription() );

		var assignee = task.getAssignee();

		assignee = (assignee !== null) ? userSmallAvatarHTML(assignee, task.id()) : "";

		return String.format(
			taskHTML, 
			task.id(), 
			task.getCaption(), 
			description_html_content, 
			generateTagsHTML(task), 
			task.getSubtasks().length.toString(), 
			progressbarHTML(achieved, " Achieved"), 
			progressbarHTML(elapsed, " Elapsed"),
			buildBreadCrumbHTML(task),
			numAchieved.toString(),
			workload.toString(),
			(workload - numAchieved).toString(),	
			assignee
		);
	}
	return null;
}

function generateTeamMembersHTML(project)
{
	var members = project.getTeamMembers();
	var html = "";
	for (var i = 0; i < members.length; i++)
	{
		var member = USERS[members[i]];
		if (member instanceof User)
		{
			html += userSmallAvatarHTML(member, project.id());
		}
	}

	html += '<div class="btn-create-user" data-source="' + project.id() + '"></div>';

	return html;
}

function generateProjectHTML(project)
{
	if (project !== null && (project instanceof Project))
	{
		var elapsed = percentageAsString(project.getConsumed(), project.getEstimate());
		var workload = Math.floor(project.getWorkload() + 0.5);
		var achieved = percentageAsString(project.getProgression(), workload);

		var numAchieved = Math.floor(project.getProgression() + 0.5);

		var description_html_content = markdown.toHTML( project.getDescription() );

		var assignee = "";

		return String.format(
			projectHTML, 
			project.id(), 
			project.getCaption(), 
			description_html_content, 
			generateTeamMembersHTML(project), 
			project.getSubtasks().length.toString(), 
			progressbarHTML(achieved, " Achieved"), 
			progressbarHTML(elapsed, " Elapsed"),
			buildBreadCrumbHTML(project),
			numAchieved.toString(),
			workload.toString(),
			(workload - numAchieved).toString(),	
			assignee
		);
	}
	return null;
}


function generateUserTaskListAsTagsHTML(taskList)
{
	var result = "";
	for (var i = 0; i < taskList.length; i++)
	{
		var task = TASKS[taskList[i]];
		if (task !== null && (task instanceof Task))
		{
			var tmp = '<div class="card-tag"><div class="card-taskastag-caption" data-source="{0}">{1}</div></div>';
			result += String.format(tmp, task.id(), task.getCaption());
		}
	}
	return result;
}


function generateUserCardHTML(user)
{
	if (user !== null && (user instanceof User))
	{
		return String.format(
			userCardHTML,
			user.id(),
			user.getName(),
			user.getRole(),
			markdown.toHTML(user.getDescription()),
			user.getAvatarUrl(),
			generateUserTaskListAsTagsHTML(user.getAssignedTasks())
		);
	}
}

function reconstructUserCard(id)
{
	showUsers();
}

function reconstructTaskCard(taskId)
{
	var tmp = $('div#' + taskId).next();
	if (tmp !== null && typeof(tmp) !== undefined && tmp.length !== 0)
	{
		var nextElem = $(tmp[0]);
		$('div#' + taskId).remove();

		var task = TASKS[taskId];
		if (task !== null && typeof(task) !== "undefined")
		{
			var html = generateTaskHTML(task);
			$(html).insertBefore(nextElem);
		}
	}
	else
	{
		tmp = $('div#' + taskId).prev();
		if (tmp !== null && typeof(tmp) !== undefined && tmp.length !== 0)
		{
			var previousElem = $(tmp[0]);
			$('div#' + taskId).remove();

			var task = TASKS[taskId];
			if (task !== null && typeof(task) !== "undefined")
			{
				var html = generateTaskHTML(task);
				$(html).insertAfter(previousElem);
			}
		}
	}
	resizeEventHandler();
}



/*
function progressbarHTML(percentage, additionnalCaption)
{
  var numericValue = Number(percentage.substring(0, percentage.length - 1));
  var progressbarType = 'progress-bar-info';
  if (numericValue > 60)
  {
    progressbarType = 'progress-bar-warning';
  }
  if (numericValue > 99)
  {
    progressbarType = 'progress-bar-danger';
  }

  var html = '<div class="progress">';
  html +='  <div class="progress-bar ' + progressbarType + '" role="progressbar" aria-valuenow="' + numericValue.toString() + '"';
  html +='  aria-valuemin="0" aria-valuemax="100" style="width:' + (numericValue > 100 ? 100 : numericValue).toString() +'%">';
  html +='    <span class="sr-only">' + percentage +  (additionnalCaption != null ? additionnalCaption : '') + '</span>';
  html +='  </div>';
  html +='</div>';

  return html;
}

*/

function removeTagFromTask(tagCaption, taskId)
{
	var task = TASKS[taskId];

	if (task !== null && (task instanceof Task))
	{
		task.removeTag(tagCaption);
		$(lastClickedObject.parent()).remove();
	}
}



function progressbarHTML(percentage, additionnalCaption)
{
	var numericValue = Number(percentage.substring(0, percentage.length - 1));
	numericValue = numericValue > 100 ? 100 : numericValue;
	var html = "";
	html +='<div class="c100 p' + numericValue.toString() + ' small ' + (numericValue > 70 ? 'orange' : '') + '">';
	html +='    <span data-from="0" data-to="' + numericValue.toString() + '" class="project-progress">' + percentage + '</span>';
	html +='    <div class="slice">';
	html +='        <div class="bar"></div>';
	html +='        <div class="fill"></div>';
	html +='    </div>';
	html +='</div>';

	if (additionnalCaption != null)
	{
		html += '<h3>' + additionnalCaption + '</h3>';
	}

	return html;
}



function toggleCardsVisibility(isVisible, taskId, animationDuration)
{

	var topShelfCards = $('#top-shelf > .task-card');

	var cards = "";
	for (var i = 0; i < topShelfCards.length; i++)
	{
		var id = $(topShelfCards[i]).attr('id');
		if (id == taskId)
			continue;

		if (isVisible)
			$('#' + id).css("display", "inline-block");			

		if (i != 1)
			cards += ", ";
		cards += '#' + id;
	}

	$(cards).animate({
	    opacity: isVisible ? 1 : 0
	}, animationDuration, function(){ 
		if (!isVisible)
		{
			for (var i = 0; i < topShelfCards.length; i++)
			{
				var id = $(topShelfCards[i]).attr('id');
				if (id == taskId)
					continue;
						

				$('#' + id).css("display", "none");
			}
		}
		
	});	


}


function fadeTopShelf(type, cardIdToIgnore, animationDuration, callbackFuncOnAnimationComplete)
{
	
	var topShelfCards = $('#top-shelf > .task-card');

	var cards = "";
	for (var i = 0; i < topShelfCards.length; i++)
	{
		var id = $(topShelfCards[i]).attr('id');
		if (id === cardIdToIgnore)
			continue;

		if (type === 'in')
			$('#' + id).css("display", "inline-block");			

		if (cards.length != 0)
			cards += ", ";
		cards += '#' + id;
	}

	var opacity = (type === "in" ? "0" : "1");
	$(cards).css("opacity", opacity);

	$(cards).animate({
	    opacity: type === 'in' ? 1 : 0
	}, animationDuration, function(){ 
		if (type === 'out')
		{
			for (var i = 0; i < topShelfCards.length; i++)
			{
				var id = $(topShelfCards[i]).attr('id');
				if (id === cardIdToIgnore)
					continue;
						

				$('#' + id).css("display", "none");
			}
		}
		// Animation complete.
	    if (callbackFuncOnAnimationComplete != null && typeof(callbackFuncOnAnimationComplete) != "undefined")
	    {
	    	callbackFuncOnAnimationComplete();
	    }
	});
}	



function fadeDrawer(type, animationDuration, callbackFuncOnAnimationComplete)
{
	switch (type)
	{
		case 'in':
			$('#ui-drawer').css("opacity", "0");
			$('#ui-drawer').removeClass('ui-screen-hidden');
			$('#ui-drawer,.drawer-pin,.drawer-content').css("width", containerWidth().toString() + "px");

			$( "#ui-drawer" ).animate({
			    opacity: 1
			}, animationDuration, function() {
				resizeEventHandler();
			    // Animation complete.
			    if (callbackFuncOnAnimationComplete != null && typeof(callbackFuncOnAnimationComplete) != "undefined")
			    {
			    	callbackFuncOnAnimationComplete();
			    }
			});

			break;

		case 'out':
			$('#ui-drawer').css("opacity", "1");
			$( "#ui-drawer" ).animate({
			    opacity: 0
			}, animationDuration, function() {
			    $('#ui-drawer').addClass('ui-screen-hidden');
			    //resizeEventHandler();
			    // Animation complete.
			    if (callbackFuncOnAnimationComplete != null && typeof(callbackFuncOnAnimationComplete) != "undefined")
			    {
			    	callbackFuncOnAnimationComplete();
			    }
			    
			});
			break;

	}
}



function toggleDrawer(isVisible, taskId, animationDuration)
{
	if (isVisible)
	{
		/*
		fadeTopShelf("out", taskId, animationDuration,
			function()
			{
			}
		);

		setTimeout( function() {
			fadeDrawer('in', animationDuration);
		}, animationDuration + 100);
		*/

		fadeDrawer('in', animationDuration);
	
	}
	else
	{
		/*
		fadeDrawer('out', animationDuration,
			function() 
			{ 
				fadeTopShelf("in", taskId, animationDuration,
					function()
					{
						
					}
				); 
			}
		);	
		*/

		fadeDrawer('out', animationDuration);

	}
}





function toggleMe(taskId)
{

	if (!isDrawerVisible)
	{		
		toggleDrawer(true, taskId, animationDuration);
		scrollAmount = $(window).scrollTop();
	}
	else
	{
		toggleDrawer(false, taskId, animationDuration);

		setTimeout( function() {
		 	$('html,body').animate({scrollTop : scrollAmount} , animationDuration);
		 }, animationDuration + 50);

	}
	isDrawerVisible = !isDrawerVisible;
}

function fillDrawer(taskId)
{
	var html = "";

	var currentTask = TASKS[taskId];
	if (currentTask !== null && typeof(currentTask) !== "undefined")
	{
		var subtasks = currentTask.getSubtasks();
		for (var i = 0; i < subtasks.length; i++)
		{
			var task = TASKS[subtasks[i]];
			if (task !== null && (task instanceof Task))
			{
				html += generateTaskHTML(task);
			}
		}
	}

	$('.drawer-content').html(html);

	$('#ui-drawer,.drawer-pin,.drawer-content').css("width", containerWidth().toString() + "px");
}




function promoteTaskToTopShelf(taskId, animationDuration)
{
	/*
	fadeTopShelf("out", taskId, animationDuration,
		function()
		{
			
		}
	);
	*/




	isDrawerVisible = true;

	// fill top shelf
	var taskObject = TASKS[taskId];
	if (taskObject != null && typeof(taskObject) != "undefined")
	{
		gCurrentTask = taskObject;

		$('#breadcrumb').html(buildBreadCrumbHTML(taskObject));

		$('#top-shelf').html("");
		updateGraphs();

		
		if (taskObject instanceof Project)
			$('#top-shelf').append(generateProjectHTML(taskObject));
		else if (taskObject instanceof Task)
			$('#top-shelf').append(generateTaskHTML(taskObject));


		var w = containerWidth();

		if (w < 753)
		{
			setTimeout(
				function()
				{
					$('#' + taskId).css("opacity" , "0");
					$('#' + taskId).css("margin-left" , "-300px");
					w = Math.floor(((containerWidth() - $('#' + taskId).width())) / 2) -20;
					$('#' + taskId).animate({ marginLeft : (w.toString() + "px"), opacity: "1"}, animationDuration);	
				},
				100
			);
		}

		fillDrawer(taskId);

		resizeEventHandler();

		fadeDrawer("in", animationDuration);
	
	}

	setTimeout(
		function() 
		{
			var elem = $('.project-progress');
			if (elem !== null)
				elem.countTo({formatter: function(value, options){  return value.toFixed(options.decimals).toString() + "%"} });
		},
		1600
	);

}

/******************************** SHOW TASKS WITH TAG ****************************/

function showTasksWithTag(tagId)
{
	fadeDrawer("out", animationDuration);
	var tag = TAGS[tagId];

	var count = 0;
	if (tag !== null && (tag instanceof Tag))
	{
		var html = ""
		var tasks = tag.getTaggedTasks();

		for (var i = 0; i < tasks.length; i++)
		{
			var task = TASKS[tasks[i]];
			if (task !== null && (task instanceof Task)) 
			{
				html += generateTaskHTML(task);	
				count++;
			}
		}
		$('#top-shelf').html(html);

		$('#breadcrumb').html('<h3>Tag: ' + tag.getCaption() + '</h3> <div class="banner-tasks-count">(' + count.toString() + ' tasks found)</div>');
	}
}


/******************************** SHOW USERS ****************************/

function showUsers(usersList)
{
	if (usersList === null  || typeof(usersList) === "undefined")
	{
		usersList = Object.keys(USERS);
	}

	fadeDrawer("out", animationDuration);

	var html = "";
	var count = 0;
	for (var i = 0; i < usersList.length; i++)
	{
		var user = USERS[usersList[i]];
		if (user !== null && (user instanceof User))
		{
			html += generateUserCardHTML(user);
			count++;
		}
	}

	$('#top-shelf').html(html);
	$('#breadcrumb').html('<h3>Users</h3> <div class="banner-tasks-count">(' + count.toString() + ' users found)</div>');

	resizeEventHandler();
	
}

/******************************** SHOW USERS ****************************/

function showProjects(projectsList)
{
	if (projectsList === null  || typeof(projectsList) === "undefined")
	{
		projectsList = Object.keys(PROJECTS);
	}

	fadeDrawer("out", animationDuration);

	var html = "";
	var count = 0;
	for (var i = 0; i < projectsList.length; i++)
	{
		var project = TASKS[projectsList[i]];
		if (project !== null && (project instanceof Project))
		{
			html += generateProjectHTML(project);
			count++;
		}
	}

	html += '<div style="display:inline; white-space:nowrap;"><div class="btn-create-project" data-source="{0}"></div><div>add project</div></div>';

	$('#top-shelf').html(html);
	$('#breadcrumb').html('<h3>Projects</h3> <div class="banner-tasks-count">(' + count.toString() + ' projects found)</div>');

	resizeEventHandler();
	
}


/************************** PROJECT CALENDAR *************************************/

function showProjectCalendar()
{
	if (gCurrentTask !== null && (gCurrentTask instanceof Task))
	{
		var project = gCurrentTask.getProject();
		buildProjectCalendar(project);
	}
}


/************************** GRAPHS *************************************/



function generateProgressionChartData()
{
	var chartData = [];

	var totalProgression = 0;
	var totalWorkload = 0;

	if (gCurrentTask != null)
	{
		if (gCurrentTask.getSubtasks().length != 0)
		{
			for (var i = 0; i < gCurrentTask.getSubtasks().length; i++)
			{
				var currentTask = TASKS[gCurrentTask.getSubtasks()[i]];

				if (currentTask !== null && (currentTask instanceof Task))
				{
					var currentWorkload = Math.floor(currentTask.getWorkload() + 0.5);
					var progress = Math.floor(currentTask.getProgression() + 0.5);
					chartData.push({
					      "caption": currentTask.getCaption(),
					      "progress": progress,
					      "remaining": currentWorkload - progress,
					      "budgeted": currentWorkload,
					      "color" : "#ff2655"
					  });
					totalProgression += progress;
					totalWorkload += currentTask.getWorkload();
				}
			}
		}
		else
		{
			var currentWorkload = Math.floor(gCurrentTask.getWorkload() + 0.5);
			var progress = Math.floor(gCurrentTask.getProgression() + 0.5);
			chartData.push({
			      "caption": gCurrentTask.getCaption(),
			      "progress": progress,
			      "remaining": currentWorkload - progress,
			      "budgeted": currentWorkload,
			      "color" : "#ff2655"
			  });

			totalProgression += progress;
			totalWorkload += currentWorkload;
		}
	}

	chartData.sort(compareWorkload);

	chartData.push({
		"cum-caption" : "done",
		"cumulative-value" : totalProgression
	});

	chartData.push({
		"cum-caption" : "remaining",
		"cumulative-value" : totalWorkload - totalProgression
	});

	return chartData;
}

function generateBurndownChartData()
{
	var chartData = [];

	if (gCurrentTask != null)
	{
		var firstRecordDate = gCurrentTask._progression.firstRecordDate();
		if (firstRecordDate !== null)
		{
			var lastRecordDate = gCurrentTask._progression.lastRecordDate();
			var elapsedDays = Math.floor(0.5 + (lastRecordDate.getTime() - firstRecordDate.getTime()) / 86400000);
			//var plotFrequencyInDays = (elapsedDays < 20 ? 1 : (Math.floor(elapsedDays / 20 + 0.5)));
			var plotFrequencyInDays = 1;



			var gapBetweenPlotInMilliSec = plotFrequencyInDays * 86400000;
			var tmpMilliSec = firstRecordDate.getTime() - gapBetweenPlotInMilliSec;
			var stopAtValue = lastRecordDate.getTime();

			while (tmpMilliSec < stopAtValue)
			{
				tmpMilliSec += gapBetweenPlotInMilliSec;

				var currentDate = new Date(tmpMilliSec);
				var dateLabel = dateAsString(currentDate);
				var workloadAtDate  = Math.floor(gCurrentTask._workload.valueAtDate(currentDate) + 0.5);
				var achievedAtDate = Math.floor(gCurrentTask._progression.valueAtDate(currentDate) + 0.5);
				var remaining = workloadAtDate - achievedAtDate ;

				chartData.push({
			        "date": dateLabel,
			        "achieved": achievedAtDate,
			        "remaining": remaining,
			        "workload": workloadAtDate
				});				
			}
		}
	}


	return chartData;
}

function generateVelocityChartData()
{
	var chartData = [];

	if (gCurrentTask != null)
	{
		var firstRecordDate = gCurrentTask._progression.firstRecordDate();
		if (firstRecordDate !== null)
		{
			var lastRecordDate = gCurrentTask._progression.lastRecordDate();
			var elapsedDays = Math.floor(0.5 + (lastRecordDate.getTime() - firstRecordDate.getTime()) / 86400000);
			//var plotFrequencyInDays = (elapsedDays < 20 ? 1 : (Math.floor(elapsedDays / 20 + 0.5)));

			var plotFrequencyInDays = Number($("#velocity-interval-combo").val());



			var gapBetweenPlotInMilliSec = plotFrequencyInDays * 86400000;
			var tmpMilliSec = firstRecordDate.getTime() - gapBetweenPlotInMilliSec;
			var stopAtValue = lastRecordDate.getTime();

			var previouslyAchieved = 0;
			while (tmpMilliSec < stopAtValue)
			{
				tmpMilliSec += gapBetweenPlotInMilliSec;

				var currentDate = new Date(tmpMilliSec);
				var dateLabel = dateAsString(currentDate);
				var workloadAtDate  = Math.floor(gCurrentTask._workload.valueAtDate(currentDate) + 0.5);
				var achievedAtDate = Math.floor(gCurrentTask._progression.valueAtDate(currentDate) + 0.5);
				var velocity = achievedAtDate - previouslyAchieved;
				previouslyAchieved = achievedAtDate;
				var remaining = workloadAtDate - achievedAtDate ;

				chartData.push({
			        "date": dateLabel,
			        "velocity": velocity,
			        "remaining": remaining,
				});				
			}
		}
	}


	return chartData;
}



function buildProgressionGraph()
{
	var id = "progression-graph";
	var title = "Progression Graph";


	progressionGraph = AmCharts.makeChart(id, {
          "theme": "light",
          "type": "serial",
          "mouseWheelScrollEnabled": false,
          "legend": {
		    "horizontalGap": 0,
		    "useGraphSettings": true,
		    "markerSize": 10
		  },
          "valueAxes": [{
              "stackType": "regular",
              "unit": "",
          }],
          "startDuration": 1,
          "graphs": [{
              "balloonText": "achieved for «[[caption]]»: [[progress]] i.e [[percents]]%",
              "fillAlphas": 1,
              "lineAlpha": 1,
              "title": "achieved",
              "type": "column",
              "valueField": "progress",
              "startEffect": "easyOutSine",
              "lineColor" : "#fcd53e"
          }, {
              "balloonText": "remaining for «[[caption]]»: [[remaining]] i.e [[percents]]%",
              "fillAlphas": 1,
              "lineAlpha": 1,
              "title": "remaining",
              "type": "column",
           
              "valueField": "remaining",
              "startEffect": "easyOutSine",
              "lineColor" : "#0dceb0"
          }
          ],
          "plotAreaFillAlphas": 0.2,
          "depth3D": 20,
          "angle": 30,
          "categoryField": "caption",
          "categoryAxis": {
              "gridPosition": "start",
              "labelRotation": 45
          },
          "export": {
            "enabled": false
           }
      });

  progressionGraph.dataProvider = generateProgressionChartData();
  progressionGraph.validateData();

}

function buildWorkloadPieChart()
{
	workloadPieChart = AmCharts.makeChart( "workload-pie-chart", {
      "type": "pie",
      "theme": "light",
      "mouseWheelScrollEnabled": false,
      "valueField": "budgeted",
      "titleField": "caption",
      "startEffect": "elastic",
      "startDuration": 2,
      "labelRadius": 5,
      "innerRadius": "50%",
      "depth3D": 20,
      "balloonText": "[[title]]<br><span style='font-size:14px'><b>[[value]]</b> ([[percents]]%)</span>",
      "angle": 40,
      "export": {
        "enabled": false
      }
    } );

    workloadPieChart.dataProvider = generateProgressionChartData();
  	workloadPieChart.validateData();
}


function buildProgressionPieChart()
{
	progressionPieChart = AmCharts.makeChart( "progression-pie-chart", {
      "type": "pie",
      "theme": "light",
      "mouseWheelScrollEnabled": false,
      "valueField": "cumulative-value",
      "titleField": "cum-caption",
      "startEffect": "elastic",
      "startDuration": 2,
      "labelRadius": 5,
      "innerRadius": "50%",
      "depth3D": 20,
      "balloonText": "[[title]]<br><span style='font-size:14px'><b>[[value]]</b> ([[percents]]%)</span>",
      "angle": 40,
      "export": {
        "enabled": false
      }
    } );

    progressionPieChart.dataProvider = generateProgressionChartData();
  	progressionPieChart.validateData();
}

function buildBurndownChart()
{
	burndownChart = AmCharts.makeChart("burndown-chart", {
	    "type": "serial",
	    "theme": "light",
	    "mouseWheelScrollEnabled": false,
	    /*
	    "legend": {
	        "equalWidths": false,
	        "useGraphSettings": true,
	        "valueAlign": "left",
	        "valueWidth": 120
	    },
	    */

	    "valueAxes": [{
	        "id": "axis",
	        "axisAlpha": 0,
	        "gridAlpha": 0,
	        "position": "left",
	        "title": "workload"
	    }],
	    "graphs": [{
	    	"id" : "g1",
	        "balloonText": "achieved: <strong>[[value]]</strong>",
	        "bullet": "round",
	        "bulletBorderAlpha": 0.5,
	        "useLineColorForBulletBorder": true,
	        "bulletColor": "#FFFFFF",
	        "bulletSizeField": 0.3,
	        "dashLengthField": 5,
	        "labelPosition": "right",
	        "legendValueText": "[[value]]",
	        "title": "Work achieved",
	        "fillAlphas": 0,
	        "valueField": "achieved",
	        "valueAxis": "axis"
	    }, {
	    	"balloonText": "remaining: <strong>[[value]]</strong>",
	        "bullet" : "square",
	        "bulletBorderAlpha": 0.5,
	        "bulletBorderThickness": 0.5,
	        "dashLengthField": "dashLength",
	        "legendValueText": "[[value]]",
	        "title": "remaining work",
	        "fillAlphas": 0,
	        "valueField": "remaining",
	        "valueAxis": "axis"
	    },{
	    	"balloonText": "workload estimate: <strong>[[value]]</strong>",
	        "dashLengthField": "dashLength",
	        "legendValueText": "[[value]]",
	        "title": "remaining work",
	        "bullet": "round",
	        "bulletBorderAlpha": 0.5,
	        "useLineColorForBulletBorder": true,
	        "fillAlphas": 0.2,
	        "valueField": "workload",
	        "hideBulletsCount": 30,
	        "valueAxis": "axis"
	    }],
	    "chartCursor": {
	        /*"categoryBalloonDateFormat": "DD",*/
	        "cursorAlpha": 0.1,
	        "cursorColor":"#000000",
	         "fullWidth":true,
	        "valueBalloonsEnabled": false,
	        "zoomable": true,
	        "cursorPosition": "mouse"
	    },
	    "chartScrollbar": {
		    "autoGridCount": true,
		    "graph": "g1",
		    "scrollbarHeight": 40
		  },
	    "dataDateFormat": "MM-DD-YYYY",
	    "categoryField": "date",
          "categoryAxis": {
              "gridPosition": "start",
              "labelRotation": 45
          },
	    "export": {
	    	"enabled": false
	     }
	});

	burndownChart.dataProvider = generateBurndownChartData();
  	burndownChart.validateData();
}


function buildVelocityChart()
{
	velocityChart = AmCharts.makeChart("velocity-chart", {
	    "type": "serial",
	    "theme": "light",
	    "mouseWheelScrollEnabled": false,
	    /*
	    "legend": {
	        "equalWidths": false,
	        "useGraphSettings": true,
	        "valueAlign": "left",
	        "valueWidth": 120
	    },
	    */

	    "valueAxes": [{
	        "id": "remainingAxis",
	        "axisAlpha": 0,
	        "gridAlpha": 0,
	        "position": "left",
	        "title": "velocity"
	    }],
	    "graphs": [{
	    	"id" : "g1",
	        "balloonText": "achieved: <strong>[[value]]</strong>",
	        "bullet": "round",
	        "bulletBorderAlpha": 0.5,
	        "useLineColorForBulletBorder": true,
	        "bulletColor": "#FFFFFF",
	        "bulletSizeField": 0.3,
	        "dashLengthField": 5,
	        "labelPosition": "right",
	        "legendValueText": "[[value]]",
	        "title": "Work achieved",
	        "fillAlphas": 0.2,
	        "valueField": "velocity",
	        "type": "smoothedLine",
	        "valueAxis": "achievedAxis"
	    }],
	    "chartCursor": {
	        /*"categoryBalloonDateFormat": "DD",*/
	        "cursorAlpha": 0.1,
	        "cursorColor":"#000000",
	         "fullWidth":true,
	        "valueBalloonsEnabled": false,
	        "zoomable": true,
	        "cursorPosition": "mouse"
	    },
	    "chartScrollbar": {
		    "autoGridCount": true,
		    "graph": "g1",
		    "scrollbarHeight": 40
		  },
	    "dataDateFormat": "MM-DD-YYYY",
	    "categoryField": "date",
          "categoryAxis": {
              "gridPosition": "start",
              "labelRotation": 45
          },
	    "export": {
	    	"enabled": false
	     }
	});

	$("#velocity-interval-combo").on("change", function() {
		velocityChart.dataProvider = generateVelocityChartData();
  		velocityChart.validateData();
	});

	velocityChart.dataProvider = generateVelocityChartData();
  	velocityChart.validateData();
}



function updateGraphs()
{

	var w = containerWidth();

	if (w < 753)
	{
		$('#top-shelf').append('<div id="graph-carousel"></div>');

		$('#graph-carousel').append(progressionPieChartHTML);
		$('#graph-carousel').append(progressionGraphHTML);
		$('#graph-carousel').append(burndownChartHTML);
		$('#graph-carousel').append(velocityChartHTML);
		$('#graph-carousel').append(workloadPieChartHTML);
	}
	else
	{
		$('#top-shelf').append(progressionPieChartHTML);
		$('#top-shelf').append(progressionGraphHTML);
		$('#top-shelf').append(workloadPieChartHTML);
		$('#top-shelf').append(burndownChartHTML);
		$('#top-shelf').append(velocityChartHTML);
	}


	buildProgressionPieChart();
	buildProgressionGraph();
	buildWorkloadPieChart();
	buildBurndownChart();
	buildVelocityChart();
}


/******************************** RESIZE HANDLING ****************************/


function resizeEventHandler()
{
	var w = containerWidth();

	$('#top-shelf,#ui-drawer,.drawer-pin,.drawer-content').css("width", w.toString() + "px");


	if (w < 420)
	{
		$("div.task-card, div.user-card").css("width", (w - 48).toString() + "px");
		$("div.user-card > div.card-pin").css("width", (w - 18).toString() + "px")
		$("div.task-card, div.user-card").css("margin-left", "-2px");
		$("div.task-card, div.user-card").css("margin-top", "5px");
		$("div.task-card, div.user-card").css("margin-bottom", "5px");
		$("div#burndown-chart, div#velocity-chart, div#progression-pie-chart, div#workload-pie-chart").css("width", (w - 22).toString() + "px");

		//$("div#graph-carousel").css("width", ((w + 20) * 5).toString() + "px");
	}
	else
	{
		var minColumnWidth = 370;
		var nbColumn = Math.floor(w / (minColumnWidth + 22));
		var optimizedColumnWidth = Math.floor((w - (minColumnWidth + 22) * nbColumn - 45) / nbColumn) + minColumnWidth;

		$("div.task-card, div.user-card").css("width", (optimizedColumnWidth - 22).toString() + "px");
		$("div.user-card > div.card-pin").css("width", (optimizedColumnWidth + 8).toString() + "px")
		$("div.task-card, div.user-card").css("margin", "15px 10px");
		$("div#burndown-chart, div#velocity-chart, div#progression-pie-chart, div#workload-pie-chart").css("width", (optimizedColumnWidth).toString() + "px");

		//$("div#graph-carousel").css("width", ((optimizedColumnWidth + 30) * 5).toString() + "px");
	}
}





/******************************** CLICK HANDLING ****************************/

function clickPerformed(evt)
{
	lastClickedObject = $(evt.target);

	// click on expand button of a card from the top shelf
	if (lastClickedObject.is('#top-shelf > .task-card > .card-footer > .card-bottom-btn-container > .btn-expand-card'))
	{
		var taskId = $(lastClickedObject).attr("data-source");
		fillDrawer(taskId);
		toggleMe(taskId);

		var taskObject = TASKS[taskId];
		if (taskObject != null && typeof(taskObject) != "undefined")
		{	
			gCurrentTask = taskObject;
			$('#breadcrumb').html(buildBreadCrumbHTML(taskObject));
		}
	}
	else if (lastClickedObject.is('.drawer-content > .task-card > .card-footer > .card-bottom-btn-container > .btn-expand-card'))
	{
		var taskId = $(lastClickedObject).attr("data-source");

		var taskObject = TASKS[taskId];
		if (taskObject != null && typeof(taskObject) != "undefined")
		{
			$('#breadcrumb').html(buildBreadCrumbHTML(taskObject));
		}

		promoteTaskToTopShelf(taskId, animationDuration);
	}
	// click on breadcrumbs
	else if (lastClickedObject.is('#breadcrumb > .crumb') || lastClickedObject.is('.card-content > .crumb'))
	{
		var taskId = $(lastClickedObject).attr("data-source");
		promoteTaskToTopShelf(taskId, animationDuration);
	}
	// click on edit task
	else if (lastClickedObject.is('.btn-edit-task'))
	{
		var taskId = $(lastClickedObject).attr("data-source");
		editTask(taskId);
	}
	// click on add subtask
	else if (lastClickedObject.is('.btn-create-task'))
	{
		var taskId = $(lastClickedObject).attr("data-source");
		createSubtask(taskId);
	}
	// click on add subtask
	else if (lastClickedObject.is('.btn-create-project'))
	{
		createSubtask(null);
	}
	// click on edit tags
	else if (lastClickedObject.is('.btn-edit-tags'))
	{
		var taskId = $(lastClickedObject).attr("data-source");
		editTags(taskId);
	}
	// click on remove tag
	else if (lastClickedObject.is('.btn-remove-tag'))
	{
		var taskId = $(lastClickedObject).attr("data-taskid");
		var tagCaption = $(lastClickedObject).attr("data-tagcaption");

		if (typeof(taskId) === "string" && typeof(tagCaption) === "string")
		{
			removeTagFromTask(tagCaption, taskId);
		}
		else if (typeof(tagCaption) === "string")
		{
			$(lastClickedObject.parent()).remove();
		}
	}
	// click on a tag
	else if (lastClickedObject.is('.card-tag-caption'))
	{
		var tagId = $(lastClickedObject).attr("data-source");
		showTasksWithTag(tagId);
	}
	// click on a task displayed as a tag
	else if (lastClickedObject.is('.card-taskastag-caption'))
	{
		var taskId = $(lastClickedObject).attr("data-source");
		promoteTaskToTopShelf(taskId, animationDuration);
	}

	// click on edit user
	else if (lastClickedObject.is('.btn-edit-user'))
	{
		var userId = $(lastClickedObject).attr("data-source");
		editUser(userId);
	}
	// click on add user
	else if (lastClickedObject.is('.btn-create-user'))
	{
		var userId = $(lastClickedObject).attr("data-source");
		createUser(userId);
	}

	// click on user avatar
	else if (lastClickedObject.is('.user-small-avatar'))
	{
		var userId = $(lastClickedObject).attr("data-source");
		showUsers([userId]);
	}

	// click on calendar
	else if (lastClickedObject.is('a.fc-day-grid-event'))
	{
		var classList = $(lastClickedObject).attr('class').split(/\s+/);
		$.each(classList, function(index, item) {
		    if (!item.startsWith('fc-')) {
		        promoteTaskToTopShelf(item, animationDuration);
		    }
		});
	}
	else if (lastClickedObject.is('span.fc-title'))
	{
		var classList = $($(lastClickedObject).parent().parent()).attr('class').split(/\s+/);
		$.each(classList, function(index, item) {
		    if (!item.startsWith('fc-')) {
		        promoteTaskToTopShelf(item, animationDuration);
		    }
		});
	}


	//*************** sidebar menu ************************

	// click on HOME
	else if (lastClickedObject.is('li#home-sidebar-entry'))
	{
		showProjects();
	}

	// click on USERS
	else if (lastClickedObject.is('li#users-sidebar-entry'))
	{
		showUsers();
	}
	// click on SEARCH
	else if (lastClickedObject.is('li#search-sidebar-entry'))
	{
		performSearch();
	}
	// click on CALENDAR
	else if (lastClickedObject.is('li#calendar-sidebar-entry'))
	{
		showProjectCalendar();
	}

}


/******************************** UI INITIALIZATION ****************************/

function initUI()
{
	$("body").unbind().click(clickPerformed);
    $(window).resize(resizeEventHandler);

    setTimeout(resizeEventHandler, 50);
}



