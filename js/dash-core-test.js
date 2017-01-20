"use strict";

var projDesc = `
Vue.js is a library for building interactive web interfaces. It provides data-reactive components with a simple and flexible API. Core features include:

- [Declarative rendering with a plain JavaScript object based reactivity system.](https://vuejs.org/guide/index.html#Declarative-Rendering)
- [Component-oriented development style with tooling support](https://vuejs.org/guide/index.html#Composing-with-Components)
- Lean and extensible core
- [Flexible transition effect system](https://vuejs.org/guide/transitions.html)
- Fast without the need for complex optimization

Note that Vue.js only supports [ES5-compliant browsers](http://kangax.github.io/compat-table/es5/) (IE8 and below are not supported). To check out live examples and docs, visit [vuejs.org](https://vuejs.org).

## Questions

For questions and support please use the [Gitter chat room](https://gitter.im/vuejs/vue) or [the official forum](http://forum.vuejs.org). The issue list of this repo is **exclusively** for bug reports and feature requests.

## Issues

Please make sure to read the [Issue Reporting Checklist](https://github.com/vuejs/vue/blob/dev/.github/CONTRIBUTING.md#issue-reporting-guidelines) before opening an issue. Issues not conforming to the guidelines may be closed immediately.

## Contribution

Please make sure to read the [Contributing Guide](https://github.com/vuejs/vue/blob/dev/.github/CONTRIBUTING.md) before making a pull request. If you have a Vue-related project/component/tool, add it with a pull-request to [this curated list](https://github.com/vuejs/awesome-vue)!

## Changelog

Details changes for each release are documented in the [release notes](https://github.com/vuejs/vue/releases).

## Stay In Touch

- For latest releases and announcements, follow on Twitter: [@vuejs](https://twitter.com/vuejs)

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2013-2016 Evan You
`;


var gTastPerLevel = 5;
var gTreeDepth = 5;

var sydleroux = new User('Syd Leroux');

var taskCaptionTemplate = ["theme-", "epic-", "story-", "task-", "subtask-"];

sydleroux.setDescription(`**Sydney Rae Leroux Dwyer** *(born May 7, 1990)* is a [Canadian American](https://en.wikipedia.org/wiki/Canadian_American) professional soccer player and [Olympic gold medalist](https://en.wikipedia.org/wiki/Olympic_gold_medal). 
As a [forward](https://en.wikipedia.org/wiki/Forward_(association_football)), she is currently signed by [FC Kansas City](https://en.wikipedia.org/wiki/FC_Kansas_City) in the [National Women's Soccer League](https://en.wikipedia.org/wiki/National_Women%27s_Soccer_League) (NWSL). 
After representing [Canada](https://en.wikipedia.org/wiki/Canada) at various youth levels, she chose to play for the United States women's national under-20 soccer team starting in 2008 and later began playing for the [U.S. senior national team](https://en.wikipedia.org/wiki/United_States_women%27s_national_soccer_team) in 2012.`);

sydleroux.setEmail('syd@leroux.com');
sydleroux.setRole('Forward/Midfielder');




function generateRandomTag(project, count)
{
	var lorem = new Lorem;
	
	for (var i = 0; i < count; i++)
	{	
		project.addTag(lorem.createText(1, Lorem.TYPE.WORD));
	}
}

function fetchRandomTag()
{
	var keys = Object.keys(TAGS);
	var i = keys.length;
	return TAGS[keys[Math.floor(Math.random() * i)]];
}

function generateRandomUser(project, count)
{
	var lorem = new Lorem;
	for (var i = 0; i < count; i++)
	{
		var user = new User(lorem.createText(2, Lorem.TYPE.WORD));
		user.setDescription(lorem.createText(5, Lorem.TYPE.SENTENCE));
		user.setEmail(lorem.createText(1, Lorem.TYPE.WORD) + "." + lorem.createText(1, Lorem.TYPE.WORD) + "@projectfurnace.org");
		var size = (58 + i).toString();
		//user.setAvatarUrl('http://lorempixel.com/'+size+'/'+size+'/');
		project.addTeamMember(user.id());
	}
}

function fetchRandomUser()
{
	var keys = Object.keys(USERS);
	var i = keys.length;
	return USERS[keys[Math.floor(Math.random() * i)]];
}

function generateRandomDueDate()
{
	return new Date(Date.now() - (190 * 86400000) + Math.floor(Math.random() * 380 * 86400000));
}



function generateRandomTask(projectId, parentTask, taskPerLevel, treeDepth)
{
	if (treeDepth == 0)
		return;

	var lorem = new Lorem;
	for (var i = 0; i < 2 + Math.floor(Math.random() * (taskPerLevel - 2) + 0.5); i++)
	{
		var owner = fetchRandomUser();

		var caption = taskCaptionTemplate[taskCaptionTemplate.length - treeDepth] + i.toString();
		var description = lorem.createText(5, Lorem.TYPE.SENTENCE);
		var task = owner.createTask(projectId, caption, description);

		task.setDueDate(generateRandomDueDate());

		var estimate = Math.floor(Math.random() * 24 * treeDepth + 0.5);
		var consumed = Math.floor(Math.min(estimate * 1.6, Math.random() * 24  * treeDepth + 0.5));

		task.setEstimate(estimate);
		task.setConsumed(consumed);

		if (Math.random() > 0.4)
		{
			task.setAssignee(fetchRandomUser());
		}


		var nTag = Math.floor(Math.random() * 8 + 0.5);
		for (var j = 0; j < nTag; j++)
		{
			var tag = fetchRandomTag();
			if (tag.getCaption() !== "done")
				task.addTag(tag.getCaption());
		}

		if (treeDepth === 1)
		{
			var wl = Math.floor(Math.random() * 48 + 0.5) + 4;
			task.setWorkload(wl, new Date(2015, 12, 31));

			var progression = 0.0;
			for (var j = 1; j < 10; j++)
			{
				if (progression > wl)
				{
					task.setProgression(wl, new Date(2016, i + 1, j * 2));
					task.addTag('done');
					break;
				}

				task.setProgression(progression, new Date(2016, i + 1, j * 2));
				progression += Math.random() * wl / 6;
			}
			
		}

		

		

		if (parentTask != null)
		{
			parentTask.addSubtask(task);
		}

		generateRandomTask(projectId, task, taskPerLevel, treeDepth - 1);
		
	}
}



function startTest()
{
	var project = new Project("proj", projDesc, sydleroux);

	project.addTeamMember(sydleroux.id());

	generateRandomTag(project, 40);
	generateRandomUser(project, 8);

	generateRandomTask(project.id(), project, gTastPerLevel, gTreeDepth);

	promoteTaskToTopShelf(project.id(), 400);

}








