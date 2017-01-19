function logicalAndTaskFiltering(tagIdList)
{
	var counter = {};
	for (var i = 0; i < tagIdList.length; i++)
	{
		var tag = TAGS[tagIdList[i]];
		if (tag !== null && (tag instanceof Tag))
		{
			var tasks = tag.getTaggedTasks();
			if (i === 0)
			{
				for (var j = 0; j < tasks.length; j++)
				{
					counter[tasks[j]] = 1;
				}
			}
			else
			{
				for (var j = 0; j < tasks.length; j++)
				{
					var currentVal = counter[tasks[j]];
					if (typeof(currentVal) === "undefined" || currentVal === null)
						continue;

					counter[tasks[j]] = currentVal + 1;
				}
			}
		}
	}

	var result = [];
	var okVal = tagIdList.length;
	var tmp = Object.keys(counter);
	for (var i = 0; i < tmp.length; i++)
	{
		if (counter[tmp[i]] === okVal)
		{
			var task = TASKS[tmp[i]];
			if (task !== null && (task instanceof Task))
			{
				result.push(task);
			}
		}
	}

	return result;
}

function fetchTagsForSearch()
{
	var result = [];
	if (gCurrentTask !== null)
	{
		var project = gCurrentTask.getProject();
		if (project !== null && (project instanceof Project))
		{
			var breadCrumb = '<div class="banner-tasks-count">Search: </div>';
			var tags = $('div.search-tag');
			
			for (var i = 0; i < tags.length; i++)
			{
				if (i !== 0)
					breadCrumb += '<div class="banner-tasks-count"> AND </div>';

				var caption = $(tags[i]).text();
				caption = caption.substr(0, caption.length - 1);

				result.push(project.id() + toSingleWord(caption));
				breadCrumb += '<h3>' + caption +  '</h3>';
			}

			$('#breadcrumb').html(breadCrumb);
		}
	}

	return result;
}

function displaySearchResult()
{
	fadeDrawer("out", animationDuration);

	var tagIdList = fetchTagsForSearch();
	var tasks = logicalAndTaskFiltering(tagIdList);

	var html = "";
	for (var i = 0; i < tasks.length; i++)
	{
		html += generateTaskHTML(tasks[i]);
	}

	$('#breadcrumb').append('<div class="banner-tasks-count"> (' + tasks.length.toString() + ' tasks found)</div>');

	$('#top-shelf').html(html);
}


function performSearch()
{
	if (gCurrentTask !== null)
	{
		var project = gCurrentTask.getProject();
		if (project !== null && (project instanceof Project))
		{
			var html = `
				<div style="display: inline-block">
			        <label class="form-label form-label-top form-label-auto" id="label_25" for="input_25">
			          Search
			        </label>
			        <div id="cid_25" class="awesomplete form-input-wide jf-required">
			          <input class="awesomplete form-textbox validate[required, AlphaNumeric]" id="task-tags-input" placeholder="type tag and enter to validate..." size="40" />
			        </div>
			    </div>
			
			<div class="settings-tag-container">
			</div>`;


			var autocompleteItems = [];
			var tags = project.getTags();
			
			for (var i = 0; i < tags.length; i++)
			{
				autocompleteItems.push(tags[i]);
			}
			

			$('#setting-dialog-content').html(html);

			  		  

			setTimeout(
				function()
				{
					$('#settings-dialog').modal();
					$('h4.modal-title').text('Search...');
					$('#btn-validate-settings').text('Search');
					$('#btn-validate-settings').unbind().click( displaySearchResult);
					centerModalDialog();

					var input = document.getElementById("task-tags-input");

					new Awesomplete(input, {
						list: autocompleteItems
					});

					$("input#task-tags-input").keypress(function(e) 
					{
					    if(e.which == 13) 
					    {
					        var tag = TAGS[project.id() + toSingleWord($("input#task-tags-input").val())];

					        if (tag !== null && (tag instanceof Tag))
					        {
								var tagHTML = '<div class="card-tag search-tag">{1}<div class="btn-remove-tag" data-tagid="{0}">x</div></div>';
								tagHTML = String.format(tagHTML, tag.id(), tag.getCaption());

								$('div.settings-tag-container').append(tagHTML);

						        $("input#task-tags-input").val("");
						    }
					    }
					});
				},
				100
			);	
		}
	}
}