
var editTaskHTML = `

<div id="TabbedPanels1" class="TabbedPanels">
  <ul class="TabbedPanelsTabGroup">
    <li class="TabbedPanelsTab" tabindex="0">General</li>
    <li class="TabbedPanelsTab" tabindex="0">Calendar Setting</li>
  </ul>
  <div class="TabbedPanelsContentGroup">
    <div class="TabbedPanelsContent">


		<form class="jotform-form" accept-charset="utf-8" novalidate="true">
		  <div class="form-all">
		    <ul class="form-section page-section">
			<li class="form-line jf-required" data-type="control_textbox" id="id_25" style="z-index: 0;">

				<div style="display: inline-block">
			        <label class="form-label form-label-top form-label-auto" id="label_25" for="input_25">
			          Short Identifier
			          <span class="form-required">
			            *
			          </span>
			        </label>
			        <div id="cid_25" class="form-input-wide jf-required">
			          <input type="text" class=" form-textbox validate[required, AlphaNumeric]" data-type="input-textbox" id="task-caption-input" size="20" maxlength="7" value="{0}">
			        </div>
			    </div>

			    <div style="display: inline-block">
			        <label class="form-label form-label-top form-label-auto" id="label_27" for="input_27"> Assignee </label>
			        <div id="cid_27" class="form-input-wide jf-required">
			          {8}
			        </div>
			    </div>
		      </li>  
		      <li class="form-line" data-type="control_textarea" id="id_26" style="z-index: 0;">
		        <label class="form-label form-label-top form-label-auto" id="label_26" for="input_26"> Description </label>
		        <div id="cid_26" class="form-input-wide jf-required">
		          <textarea id="settings-task-descritpion" class="form-textarea custom-hint-group form-custom-hint" cols="{6}" rows="15" data-component="textarea" data-customhint="Description" customhinted="true" spellcheck="false">{1}</textarea>
		        </div>
		      </li>
		      
		      <li class="form-line" id="id_42" style="z-index: 0;">
		        <label class="form-label form-label-top form-label-auto" id="label_28" for="input_28">
		          Due Date
		          <span class="form-required">
		            *
		          </span>
		        </label>
		        <div id="cid_28" class="form-input-wide jf-required">
		          <span class="form-sub-label-container" style="vertical-align: top;">
		            <input class="form-textbox validate[required, limitDate, validateLiteDate]" id="task-due-date" type="text" size="12" data-maxlength="12" value="{7}" data-format="mmddyyyy" data-seperator="/" placeholder="mm/dd/yyyy">
		          </span>
		        </div>
		      	<div class="form-description" style="display: none;"><div class="form-description-arrow"></div><div class="form-description-arrow-small"></div><div class="form-description-content">Task due date</div></div>
		      </li>
		      
		      <li class="form-line jf-required" data-type="control_textbox" id="id_29">
		      	<div style="display: inline-block">
			        <label class="form-label form-label-top form-label-auto" id="label_29" for="input_29">
			          Estimated Workload
			          <span class="form-required">
			            *
			          </span>
			        </label>
			        <div id="cid_29" class="form-input-wide jf-required">
			          <input type="text" class=" form-textbox validate[required, Numeric]" data-type="input-textbox" id="task-workload-input"  size="20" value="{2}" >
			          <input type="text" class="ui-screen-hidden" id="task-workload-input-date">
			        </div>
			    </div>
		      
		      	<div style="display: inline-block">
			        <label class="form-label form-label-top form-label-auto" id="label_31" for="input_31"> Achieved </label>
			        <div id="cid_31" class="form-input-wide jf-required">
			          <input type="text" class=" form-textbox validate[Numeric]" data-type="input-textbox" id="task-achieved-input" size="20" value="{3}" >
			          <input type="text" class="ui-screen-hidden" id="task-achieved-input-date">
			        </div>
			    </div>
			    </li>


			    <li class="form-line jf-required" data-type="control_textbox" id="id_30">
		      	<div style="display: inline-block">
			        <label class="form-label form-label-top form-label-auto" id="label_30" for="input_30">
			          Estimated Duration
			          <span class="form-required">
			            *
			          </span>
			        </label>
			        <div id="cid_30" class="form-input-wide jf-required">
			          <input type="text" class=" form-textbox validate[required, AlphaNumeric]" data-type="input-textbox" id="task-duration-input" size="20" placeholder="1d" value="{4}">
			          <input type="text" class="ui-screen-hidden" id="task-duration-input-date">
			        </div>
			      </div>


		      	<div style="display: inline-block">
			        <label class="form-label form-label-top form-label-auto" id="label_32" for="input_32"> Time consumed </label>
			        <div id="cid_32" class="form-input-wide jf-required">
			          <input type="text" class=" form-textbox validate[AlphaNumeric]" data-type="input-textbox" id="task-consumed-input" size="20" value="{5}">
			          <input type="text" class="ui-screen-hidden" id="task-consumed-input-date">
			        </div>
			    </div>
		      </li>

		    </ul>
		  </div>
		  </form>

		</div>
		<div class="TabbedPanelsContent">
		<h3>Working hours</h3><br/>
		{9}
		</div>
	</div>
</div>

`;


function fetchTaskCalendarData()
{
	var result = {};
	for (var i = 0; i < 7; i++)
	{
		var checked = document.getElementById('task-calendar-' + i.toString() + '-checkbox').checked;
		if (checked)
		{
			var start = $('input#task-calendar-' + i.toString() + '-start').val();
			var end = $('input#task-calendar-' + i.toString() + '-end').val();
			result[i] = new BusinessHours(start, end);
		}
	}

	return result;
}


function commitSettingsToTask(id)
{
	var task = TASKS[id];

	if (task !== null)
	{
		var markdownTxt = $('#settings-task-descritpion').val();
		task.setDescription(markdownTxt);

		var caption = $('input#task-caption-input').val();
		var duration = Number($('input#task-duration-input').val());
		var consumed = Number($('input#task-consumed-input').val());
		var workload = Number($('input#task-workload-input').val());
		var progression = Number($('input#task-achieved-input').val());
		var dueDate = $('input#task-due-date').datepick('getDate')[0];

		var durationDate = $('input#task-duration-input-date').datepick('getDate')[0];
		var consumedDate = $('input#task-consumed-input-date').datepick('getDate')[0];
		var workloadDate = $('input#task-workload-input-date').datepick('getDate')[0];
		var achievedDate = $('input#task-achieved-input-date').datepick('getDate')[0];

		var assignee = $('#task-assignee-combo').val();
		if (assignee === "no-assignee")
			assignee = null;
		else
			assignee = USERS[assignee];
		

		if (task.getEstimate() !== duration)
		{
			task.setEstimate(duration, durationDate);
		}

		if (task.getConsumed() != consumed)
		{
			task.setConsumed(consumed, consumedDate);
		}

		if (task.getWorkload() != workload)
		{
			task.setWorkload(workload, workloadDate);
		}

		if (task.getProgression() != progression)
		{
			task.setProgression(progression, achievedDate);
		}

		task.setCaption(caption);
		task.setDueDate(dueDate);
		task.setAssignee(assignee);

		task._businessHours = fetchTaskCalendarData();

		reconstructTaskCard(id);
	}
}


function commitSubtaskCreation(parentTaskId)
{
	var task = TASKS[parentTaskId];

	if (task !== null)
	{
		var desc = $('#settings-task-descritpion').val();
		var caption = $('#task-caption-input').val();

		var project = task.getProject();

		var subtask = new Task(project === null ? null : project.id(), caption, desc, task.getAuthor());

		
		var duration = Number($('#task-duration-input').val());
		var consumed = Number($('#task-consumed-input').val());
		var workload = Number($('#task-workload-input').val());
		var progression = Number($('#task-achieved-input').val());
		var dueDate = $('input#task-due-date').datepick('getDate');
		var assignee = $('#task-assignee-combo').val();
		if (assignee === "no-assignee")
			assignee = null;
		else
			assignee = USERS[assignee];


		subtask.setEstimate(duration);
		subtask.setConsumed(consumed);
		subtask.setProgression(progression);
		subtask.setWorkload(workload);
		subtask.setDueDate(dueDate);
		subtask.setAssignee(assignee);

		subtask._businessHours = fetchTaskCalendarData();

		task.addSubtask(subtask);

		promoteTaskToTopShelf(parentTaskId, 500);
		
	}
}


function centerModalDialog()
{
	var hmargin = Math.floor((containerWidth() - $('.modal-content').width()) / 2);
	$('#settings-dialog > .modal-dialog').css('left', '0px');
	$('#settings-dialog > .modal-dialog').css('margin-left', hmargin.toString() + 'px');
}


function taskDescriptionTextAreaWidth()
{
	var w = containerWidth();
	var nbColumns = 120;

	if (w < 1200)
		nbColumns -= 20;

	if (w < 1000)
		nbColumns -= 10;

	if (w < 800)
		nbColumns -= 15;

	if (w < 600)
		nbColumns -= 15;

	if (w < 420)
		nbColumns -= 20;

	return nbColumns;
}


function businessHourHTML(task)
{
	var html = "";
	var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	for (var i = 0; i < 7; i++)
	{
		var businessHour = task.getBusinessHours(i);
		html += '<div class="businesshour-container">';
		html += '<div class="calendar-setting-label">' + days[i] + ': </div><input type="checkbox" id="task-calendar-' + i.toString() + '-checkbox" ' +  (businessHour !== null ? "checked" : "") + '>';
		html += '<div class="calendar-setting-label">Start</div>';
		html += '<input type="time" id="task-calendar-' + i.toString() + '-start" value="' +  (businessHour !== null ? businessHour.getStartTime() : "09:00") + '">';
		html += '<div class="calendar-setting-label">End </div>';
		html += '<input type="time" id="task-calendar-' + i.toString() + '-end" value="' +  (businessHour !== null ? businessHour.getEndTime() : "16:00") + '">';
		html += '</div>';
	}

	return html;
}

function projectTeamMembersAsComboHTML(project, selectedUser)
{
	var html = `
	<select class="form-dropdown" style="width:150px;" id="task-assignee-combo">
	    <option value="no-assignee">No Assignee</option>`;

	if (project !== null && (project instanceof Project))
	{
		var members = project.getTeamMembers();
		for (var i = 0; i < members.length; i++)
		{
			var member = USERS[members[i]];
			if (member !== null && (member instanceof User))
			{
				var id = member.id();
				var isSelected = selectedUser !== null && selectedUser.id() === id;
				html += '<option value="' + id +'" ' + (isSelected ? 'selected' : '') +  '>' + member.getName() + '</option>';
			}
		}
	}

	html += "</select>";

	return html;
}


function editTask(id)
{

	var task = TASKS[id];



	if (task !== null && typeof(task) !== "undefined")
	{
		var workload = Math.floor(task.getWorkload() + 0.5);
		var achieved = Math.floor(task.getProgression() + 0.5);
		var estimate = Math.floor(task.getEstimate() + 0.5);
		var consumed = Math.floor(task.getConsumed() + 0.5);

		var nbColumns = taskDescriptionTextAreaWidth();

		var html = String.format(editTaskHTML,
			task.getCaption(),
			task.getDescription(),
			workload.toString(),
			achieved.toString(),
			estimate.toString(),
			consumed.toString(),
			nbColumns,
			dateAsString(task.getDueDate()),
			projectTeamMembersAsComboHTML(task.getProject(), task.getAssignee()),
			businessHourHTML(task)
		);

	  	$('#setting-dialog-content').html(html);

	  	var TabbedPanels1 = new Spry.Widget.TabbedPanels("TabbedPanels1");

		  

		setTimeout(
			function()
			{
				$('#settings-dialog').modal();
				$('h4.modal-title').text('Edit Task...');
				$('#btn-validate-settings').text('Validate');
				$('#btn-validate-settings').unbind().click( function() { commitSettingsToTask(id); });
				$('input#task-due-date').datepick();

				$('input#task-duration-input-date').datepick({showTrigger: '<img class="showAutoCalendar" alt="Pick a Date" src="img/taskedit/calendar.png">'});		
				$('input#task-consumed-input-date').datepick({showTrigger: '<img class="showAutoCalendar" alt="Pick a Date" src="img/taskedit/calendar.png">'});

				if (task.getSubtasks().length !== 0)
				{
					$('#task-workload-input').attr('readonly', 'readonly');
					$('#task-achieved-input').attr('readonly', 'readonly');
				}
				else
				{
					$('input#task-workload-input-date').datepick({showTrigger: '<img class="showAutoCalendar" alt="Pick a Date" src="img/taskedit/calendar.png">'});
					$('input#task-achieved-input-date').datepick({showTrigger: '<img class="showAutoCalendar" alt="Pick a Date" src="img/taskedit/calendar.png">'});
				}

				centerModalDialog();
			},
			100
		);

	}
}

function commitTagCreation(taskId, tagCaption)
{
	var task = TASKS[taskId];

	if (task !== null && (task instanceof Task))
	{
		if (task.hasTag(tagCaption))
			return;

		var	tag = Tag.getOrCreateTag(task._projectId, tagCaption);

		task.addTag(tagCaption);

		var tmp = '<div class="card-tag"><div class="card-tag-caption">{0}</div><div class="btn-remove-tag" data-tagcaption="{0}" data-taskid={1}>x</div></div>';
		var html = String.format(tmp, tag.getCaption(), task.id());

		$('div.settings-tag-container').append(html);

	}
}


function editTags(taskId)
{
	var task = TASKS[taskId];

	if (task !== null && (task instanceof Task))
	{
		var html = `
			<div style="display: inline-block">
		        <label class="form-label form-label-top form-label-auto" id="label_25" for="input_25">
		          Enter tag
		        </label>
		        <div id="cid_25" class="awesomplete form-input-wide jf-required">
		          <input class="awesomplete form-textbox validate[required, AlphaNumeric]" id="task-tags-input" placeholder="type tag and enter to validate..." size="40" />
		        </div>
		    </div>
		
		<div class="settings-tag-container">
			{0}
		</div>`;


		var tags = task.getTags();
		var existingTags = "";
		for (var i = 0; i < tags.length; i++)
		{
			var tag = TAGS[task._projectId + toSingleWord(tags[i])];
			if (tag !== null && (tag instanceof Tag))
			{
				var tmp = '<div class="card-tag">{0}<div class="btn-remove-tag" data-tagcaption="{0}" data-taskid={1}>x</div></div>';
				existingTags += String.format(tmp, tag.getCaption(), task.id());
			}
		}


		var project = task.getProject();

		if (project !== null)
		{
			var autocompleteItems = [];
			var tags = project.getTags();
			for (var i = 0; i < tags.length; i++)
			{
				autocompleteItems.push(tags[i]);
			}
		}
		
    

		html = String.format(html, existingTags);

		$('#setting-dialog-content').html(html);

		  		  

		setTimeout(
			function()
			{
				$('#settings-dialog').modal();
				$('h4.modal-title').text('Edit Tags...');
				$('#btn-validate-settings').text('Validate');
				$('#btn-validate-settings').unbind().click( function() { reconstructTaskCard(taskId); });
				centerModalDialog();

				var input = document.getElementById("task-tags-input");

				new Awesomplete(input, {
					list: autocompleteItems
				});

				$("input#task-tags-input").keypress(function(e) {
				    if(e.which == 13) {
				        commitTagCreation(taskId, $("input#task-tags-input").val());
				        $("input#task-tags-input").val("");
				    }
				});
			},
			100
		);
	}
		
}


function createSubtask(parentTaskId)
{
	
	var workload = 8;
	var achieved = 0;
	var estimate = 8;
	var consumed = 0;

	var parentTask = TASKS[parentTaskId];

	if (parentTask !== null && (parentTask instanceof Task))
	{
		var nbColumns = taskDescriptionTextAreaWidth();

		var html = String.format(editTaskHTML,
			"???",
			"Please provide a task description here...",
			workload.toString(),
			achieved.toString(),
			estimate.toString(),
			consumed.toString(),
			nbColumns,
			dateAsString(new Date()),
			projectTeamMembersAsComboHTML(parentTask.getProject(), null),
			businessHourHTML(parentTask.getProject())
		);

	  	$('#setting-dialog-content').html(html);

	  	var TabbedPanels1 = new Spry.Widget.TabbedPanels("TabbedPanels1");

		  

		setTimeout(
			function()
			{
				$('#settings-dialog').modal();
				$('h4.modal-title').text('Create Subtask...');
				$('#btn-validate-settings').text('Create Subtask');
				$('#btn-validate-settings').unbind().click( function() { commitSubtaskCreation(parentTaskId); });
				$('input#task-due-date').datepick();

				centerModalDialog();
			},
			100
		);
	}
}