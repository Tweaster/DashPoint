
"use strict";

var TASKS = {};
var USERS = {};
var TAGS = {};
var PROJECTS = {};



/* ---------------------------------------------------------------- *
 * class Tag
 *
 * summary: This class represents a record
 * description: a record is used to record values over the course of
 * 		time such as work progression etc.
 *
 * ---------------------------------------------------------------- */


 class Record
 {
 	/* ------------------------------------------------------------- *
	 * method: constructor
	 * ------------------------------------------------------------- */
 	constructor()
 	{
 		this._rec = {};
 		var d = new Date(2014, 10, 22);
 		var t = d.getTime();
 		var s = t.toString();
 		this._rec["last"] = t;
 		this._rec[s] = 0.0;
 		
 	}


 	/* ------------------------------------------------------------- *
	 * method: record() records a value at the given date (date is optionnal)
	 * ------------------------------------------------------------- */
 	record(value, date)
 	{
 		if (date === null || !(date instanceof Date))
 		{
 			var tmp = new Date();
 			date = new Date(tmp.getFullYear(), tmp.getMonth(), tmp.getDate());
 		}

 		var t = date.getTime();
 		var s = t.toString();
 		this._rec[s] = value;
 		if (this._rec["last"] <= t)
 		{
 			this._rec["last"] = t;
 		}
 	}

 	/* ------------------------------------------------------------- *
	 * method: lastValue() returns the last recorded value
	 * ------------------------------------------------------------- */
 	lastValue()
 	{
 		return this._rec[this._rec["last"].toString()];
 	}

 	/* ------------------------------------------------------------- *
	 * method: valueAtDate() returns the value at the given date
	 * 		if no value was recorded at this date, the closest value 
	 *		will be return
	 * ------------------------------------------------------------- */
 	valueAtDate(date)
 	{
 		if (date !== null && (date instanceof Date))
 		{
 			var t = date.getTime();
 			if (t > this._rec["last"])
 				return this._rec[this._rec["last"].toString()];

 			var lastValidTime = -1;
 			for (var key in this._rec) {
 				if (key === "last")
 					continue;

 				var n = Number(key);
 				if (lastValidTime <= n && n <= t )
 					lastValidTime = n;

 				if (n === t)
 					break;
 			}

 			return ((lastValidTime === -1) ? -1 : this._rec[lastValidTime.toString()]);
 		}
 	}

 	sortedKeys()
 	{
 		var result = Object.keys(this._rec);
 		result.sort(
 			function (a, b)
 			{
 				if (a === "last")
 					return -1;
 				if (b === "last")
 					return 1;
 				return Number(a) - Number(b)		
 			}
 		);

 		return result;
 	}

 	firstRecordDate()
 	{
 		var tmp = this.sortedKeys();
 		if (tmp.length > 2)
 		{
 			return new Date(Number(tmp[2]));
 		}

 		return null;
 	}

 	lastRecordDate()
 	{
 		return new Date(this._rec["last"]);
 	}
 }


 class BusinessHours
 {
 	constructor( startTime, endTime)
 	{
 		this._s = startTime;
 		this._e = endTime;
 	}

 	static getDefault()
 	{
 		return new BusinessHours("09:00", "17:00");
 	}

 	getStartTime()
 	{
 		return this._s;
 	}

 	setStartTime(t)
 	{
 		this._s = t;
 	}

 	getEndTime()
 	{
 		return this._e;
 	}

 	setEndTime(t)
 	{
 		this._e = t;
 	}
 }


/* ---------------------------------------------------------------- *
 * class Tag
 *
 * summary: This class represents a Tag assigned to a task
 * description: This class represents a Tag assigned to a task.
 *		The purpose of tags is to classify and filter tasks
 *
 * ---------------------------------------------------------------- */

class Tag
{
	/* ------------------------------------------------------------- *
	 * method: constructor
	 * ------------------------------------------------------------- */
	constructor(projectId, caption)
	{
		this._id = projectId + toSingleWord(caption);
		this._caption = caption;
		this._tasks = {};

		TAGS[this._id] = this;

	}

	/* ------------------------------------------------------------- *
	 * method: id() returns the id of this tag
	 * ------------------------------------------------------------- */
	id()
	{
		return this._id;
	}

	/* ------------------------------------------------------------- *
	 * method: getCaption() returns the caption for this tag
	 * ------------------------------------------------------------- */
	getCaption()
	{
		return this._caption;
	}

	/* ------------------------------------------------------------- *
	 * method: addToTask() add the tag to the specified task
	 * ------------------------------------------------------------- */
	addToTask(task)
	{
		if (this._tasks[task.id()] === null || typeof(this._tasks[task.id()]) === "undefined")
		{
			this._tasks[task.id()] = task.id();
		}
	}

	/* ------------------------------------------------------------- *
	 * method: removeFromTask() remove the tag from the specified task
	 * ------------------------------------------------------------- */
	removeFromTask(task)
	{
		if (this._tasks[task.id()] !== null)
		{
			delete this._tasks[task.id()];
		}
	}

	/* ------------------------------------------------------------- *
	 * method: getTaggedTasks() returns the list of tasks with current tag
	 * ------------------------------------------------------------- */
	 getTaggedTasks()
	 {
	 	return Object.keys(this._tasks);
	 }

	 /* ------------------------------------------------------------- *
	 * method: getOrCreateTag() returns the tag with the provided caption
	 * ------------------------------------------------------------- */
	 static getOrCreateTag(projectId, caption)
	 {
	 	var id = projectId + toSingleWord(caption);
	 	var result = TAGS[id];
	 	if (typeof(result) !== "undefined" && (result instanceof Tag))
	 	{
	 		return result;
	 	}
	 	else
	 	{
	 		return new Tag(projectId, caption);
	 	}
	 }
}





/* ---------------------------------------------------------------- *
 * class User
 *
 * summary: This class represents a user
 * description: 
 *
 * ---------------------------------------------------------------- */

class User
{
	/* ------------------------------------------------------------- *
	 * method: constructor
	 * ------------------------------------------------------------- */
	constructor(name)
	{
		this._id = guid();
		this._name = name;
		this._assignedTasks = [];
		this._authTasks = [];
		this._email = "";
		this._role = "Team Member";
		this._desc = "";
		this._avUrl = "img/avatar.png";

		USERS[this._id] = this;
	}

	/* ------------------------------------------------------------- *
	 * method: id() returns the id for this user
	 * ------------------------------------------------------------- */
	id()
	{
		return this._id;
	}

	/* ------------------------------------------------------------- *
	 * method: setName() sets the user's name
	 * ------------------------------------------------------------- */
	setName(name)
	{
		return this._name = name;
	}

	/* ------------------------------------------------------------- *
	 * method: getName() returns the user's name
	 * ------------------------------------------------------------- */
	getName()
	{
		return this._name;
	}

	/* ------------------------------------------------------------- *
	 * method: setEmail() sets the user's email
	 * ------------------------------------------------------------- */
	setEmail(email)
	{
		return this._email = email;
	}

	/* ------------------------------------------------------------- *
	 * method: getEmail() returns the user's email
	 * ------------------------------------------------------------- */
	getEmail()
	{
		return this._email;
	}

	/* ------------------------------------------------------------- *
	 * method: setRole() sets the user's role
	 * ------------------------------------------------------------- */
	setRole(role)
	{
		return this._role = role;
	}

	/* ------------------------------------------------------------- *
	 * method: getRole() returns the user's role
	 * ------------------------------------------------------------- */
	getRole()
	{
		return this._role;
	}

	/* ------------------------------------------------------------- *
	 * method: getDescription() returns the description for this user
	 * ------------------------------------------------------------- */
	getDescription()
	{
		return this._desc;
	}

	/* ------------------------------------------------------------- *
	 * method: setDescription() sets the description for this user
	 * ------------------------------------------------------------- */
	setDescription(description)
	{
		this._desc = description;
	}

	/* ------------------------------------------------------------- *
	 * method: setAvatarUrl() sets the user's avatar url
	 * ------------------------------------------------------------- */
	setAvatarUrl(url)
	{
		return this._avUrl = url;
	}

	/* ------------------------------------------------------------- *
	 * method: getAvatarUrl returns the user's avatar url
	 * ------------------------------------------------------------- */
	getAvatarUrl()
	{
		return this._avUrl;
	}

	/* ------------------------------------------------------------- *
	 * method: createTask() create a task where the current user
	 *		has the ownerfship of this task
	 * ------------------------------------------------------------- */
	createTask(projectId, caption, description)
	{
		var newTask = new Task(projectId, caption, description, this);
		this._authTasks.push(newTask.id());
		return newTask;
	}

	/* ------------------------------------------------------------- *
	 * method: loseOwnership() methat that allows the current user
	 *		 to lose the ownership of the provided task
	 * ------------------------------------------------------------- */
	loseOwnership(task)
	{
		var i = this._authTasks.indexOf(task.id());

		if (i !== -1)
		{
			this._authTasks.splice(i, 1);
		}
	}

	/* ------------------------------------------------------------- *
	 * method: takeOwnership() method that allows the current user
	 * 		to take ownership of the provided task
	 * ------------------------------------------------------------- */
	takeOwnership(task)
	{
		var previousAuthor = task.getAuthor();
		if (previousAuthor != null && typeof(previousAuthor) !== "undefined")
		{
			previousAuthor.loseOwnership(task);
		}
		task.setAuthor(this);

		var i = this._authTasks.indexOf(task.id());
		if (i === -1)
		{
			this._authTasks.push(task.id());
		}

	}

	/* ------------------------------------------------------------- *
	 * method: releaseTask() method that allows the current user to
	 *	no longer be assigned to the provided task
	 * ------------------------------------------------------------- */
	releaseTask(task)
	{
		var i = this._assignedTasks.indexOf(task.id());

		if (i !== -1)
		{
			this._assignedTasks.splice(i, 1);
			task.setAssignee(null);
		}
	}

	/* ------------------------------------------------------------- *
	 * method: takeTask() method that allows the current user to
	 *	be assigned to the provided task
	 * ------------------------------------------------------------- */
	takeTask(task)
	{
		var previousAssignee = task.getAssignee();
		if (previousAssignee != null && typeof(previousAssignee) !== "undefined" && task.getAssignee() != this)
		{
			previousAssignee.releaseTask(task);
		}

		if (task.getAssignee() != this)
		{
			task.setAssignee(this);
		}

		var i = this._assignedTasks.indexOf(task.id());

		if (i === -1)
		{
			this._assignedTasks.push(task.id());
		}

	}

	/* ------------------------------------------------------------- *
	 * method: getAuthoredTasks() return all the task this user authored
	 * ------------------------------------------------------------- */
	getAuthoredTasks()
	{
		return this._authTasks;
	}

	/* ------------------------------------------------------------- *
	 * method: getAssignedTasks() get all the tasks assigned to this user
	 * ------------------------------------------------------------- */
	getAssignedTasks()
	{
		return this._assignedTasks;
	}
}


/* ---------------------------------------------------------------- *
 * class Task
 *
 * summary: 
 * description: 
 *
 * ---------------------------------------------------------------- */

class Task
{
	/* ------------------------------------------------------------- *
	 * method: constructor
	 * ------------------------------------------------------------- */
	constructor(projectId, caption, description, author)
	{
		this._id = guid();
		this._projectId = (projectId === null ? this._id : projectId);
		this._caption = caption;
		this._desc = description;
		this._estimate = new Record;
		this._consumed = new Record;
		this._progression = new Record;
		this._workload = new Record;
		this._tags = [];
		this._author = author !== null ? author.id() : null;
		this._assignee = null;
		this._parent = null;
		this._subTasks = [];
		this._level = 0;
		this._bh = {};
		this._dueDate = new Date(Date.now() + 2419200000); // today + 28 days

		TASKS[this._id] = this;

		this.addTag('work package');
		this.addTag('no assignee');
		this.addTag('no estimate');

		if (projectId !== null)
		{
			var project = TASKS[projectId];
			if (project !== null && (project instanceof Project))
			{
				for (var i = 0; i < 6; i++)
				{
					var tmp = project.getBusinessHours(i);
					if (tmp !== null)
					{
						var bh = new BusinessHours(tmp._s, tmp._e);
						this._bh[i] = bh;
					}
				}
			}
		}
		else
		{
			this.setDefaultBusinessHours();
		}
	}

	/* ------------------------------------------------------------- *
	 * method: refresh parent
	 * ------------------------------------------------------------- */
	 refreshParent()
	 {
	 	var parent = this.getParent();
	 	if (parent !== null && (parent instanceof Task))
	 	{
	 		var progression = new Record;
	 		var workload = new Record;


	 		var tmp = {};

	 		
			for (var i = 0; i < parent.getSubtasks().length; i++)
	 		{
	 			var task = TASKS[parent.getSubtasks()[i]];

	 			if (task !== null && (task instanceof Task))
	 			{
		 			for (var key in task._workload._rec)
		 			{
		 				if (key === "last")
		 					continue;

		 				tmp[key] = 0;
		 			}
		 		}
	 		}
	 		var keys = Object.keys(tmp);
	 		keys.sort();

	 		for (var k = 0; k < keys.length; k++)
	 		{
	 			var key = keys[k];

	 			var currentDate = new Date(Number(key));

		 		var taskWorkloadAtDate = 0.0;
	 			for (var i = 0; i < parent.getSubtasks().length; i++)
		 		{
		 			var task = TASKS[parent.getSubtasks()[i]];
		 			if (task !== null && (task instanceof Task))
	 				{
		 				taskWorkloadAtDate += task._workload.valueAtDate(currentDate);
		 			}
		 		}

		 		if (taskWorkloadAtDate > 0.000001)
		 		{
		 			workload.record(taskWorkloadAtDate, currentDate);
		 		}
	 		}
	 		



			tmp = {};
			for (var i = 0; i < parent.getSubtasks().length; i++)
	 		{
	 			var task = TASKS[parent.getSubtasks()[i]];

	 			if (task !== null && (task instanceof Task))
	 			{
		 			for (var key in task._progression._rec)
		 			{
		 				if (key === "last")
		 					continue;

		 				tmp[key] = 0;
		 			}
		 		}
	 		}
	 		keys = Object.keys(tmp);
	 		keys.sort();

	 		for (var k = 0; k < keys.length; k++)
	 		{
	 			var key = keys[k];

	 			var currentDate = new Date(Number(key));

		 		var taskAccomplishedAtDate = 0.0;
	 			for (var i = 0; i < parent.getSubtasks().length; i++)
		 		{
		 			var task = TASKS[parent.getSubtasks()[i]];
		 			if (task !== null && (task instanceof Task))
	 				{
			 			var taskProgressionAtDate = task._progression.valueAtDate(currentDate);
		 				taskAccomplishedAtDate += taskProgressionAtDate;
		 			}
		 		}

		 		if (taskAccomplishedAtDate > 0.000001)
		 		{
		 			progression.record(taskAccomplishedAtDate, currentDate);
		 		}
	 		}


	 		delete parent._progression;
	 		delete parent._workload;

	 		parent._progression = progression;
	 		parent._workload = workload;

	 		parent.refreshParent();
	 	}
	 }

	/* ------------------------------------------------------------- *
	 * method: id() returns the id for the current task
	 * ------------------------------------------------------------- */
	id()
	{
		return this._id;
	}

	/* ------------------------------------------------------------- *
	 * method: getLevel() returns the level for the current task
	 * ------------------------------------------------------------- */
	getLevel()
	{
		return this._level;
	}

	/* ------------------------------------------------------------- *
	 * method: getProject() returns the project this task belongs to
	 * ------------------------------------------------------------- */
	getProject()
	{
		if (this._projectId === null)
			return null;

		return TASKS[this._projectId];
	}

	/* ------------------------------------------------------------- *
	 * method: getDueDate() returns the due date for the current task
	 * ------------------------------------------------------------- */
	getDueDate()
	{
		return this._dueDate;
	}

	/* ------------------------------------------------------------- *
	 * method: setDueDate() sets the due date for this task
	 * ------------------------------------------------------------- */
	setDueDate(dueDate)
	{
		this._dueDate = dueDate;
	}

	/* ------------------------------------------------------------- *
	 * method: caption() returns the caption for the current task
	 * ------------------------------------------------------------- */
	getCaption()
	{
		return this._caption;
	}


	/* ------------------------------------------------------------- *
	 * method: getBusinessHours() returns the task business hours for
	 * this task at the provided day
	 * ------------------------------------------------------------- */
	getBusinessHours(day)
	{
		var result =  this._bh[day];
		if (!(result instanceof(BusinessHours)))
			return null;

		return result;
	}

	/* ------------------------------------------------------------- *
	 * method: setBusinessHours() sets the task business hours for
	 * this task at the provided day
	 * ------------------------------------------------------------- */
	setBusinessHours(day, businessHours)
	{
		this._bh[day] = businessHours;
	}

	/* ------------------------------------------------------------- *
	 * method: setCaption() sets the caption for this task
	 * ------------------------------------------------------------- */
	setCaption(caption)
	{
		this._caption = caption;
	}

	/* ------------------------------------------------------------- *
	 * method: getWorkload() returns the workload for the current task
	 * ------------------------------------------------------------- */
	getWorkload(date)
	{
		if (date === null || !(date instanceof Date))
			return this._workload.lastValue();

		return this._workload.valueAtDate(date);
	}

	/* ------------------------------------------------------------- *
	 * method: setWorkload() sets the workload for this task
	 * ------------------------------------------------------------- */
	setWorkload(workload, date)
	{
		this._workload.record(workload, date);

		this.refreshParent();
	}

	/* ------------------------------------------------------------- *
	 * method: getDescription() returns the description for this task
	 * ------------------------------------------------------------- */
	getDescription()
	{
		return this._desc;
	}

	/* ------------------------------------------------------------- *
	 * method: setDescription() sets the description for this task
	 * ------------------------------------------------------------- */
	setDescription(description)
	{
		this._desc = description;
	}

	/* ------------------------------------------------------------- *
	 * method: getEstimate() returns the estimate for this task
	 * ------------------------------------------------------------- */
	getEstimate(date)
	{
		if (date === null || !(date instanceof Date))
			return this._estimate.lastValue();

		return this._estimate.valueAtDate(date);
	}

	/* ------------------------------------------------------------- *
	 * method: setEstimate() sets the estimate for this task
	 * ------------------------------------------------------------- */
	setEstimate(estimate, date)
	{
		this._estimate.record(estimate, date);
	}

	/* ------------------------------------------------------------- *
	 * method: getConsumed() returns the consumed time/resource for this task
	 * ------------------------------------------------------------- */
	getConsumed(date)
	{
		if (date === null || !(date instanceof Date))
			return this._consumed.lastValue();

		return this._consumed.valueAtDate(date);
	}

	/* ------------------------------------------------------------- *
	 * method: setConsumed() sets the consumed time/resource for this task
	 * ------------------------------------------------------------- */
	setConsumed(consumed, date)
	{
		this._consumed.record(consumed, date);
	}

	/* ------------------------------------------------------------- *
	 * method: getProgression() returns the current progression for this task
	 * ------------------------------------------------------------- */
	getProgression(date)
	{
		if (date === null || !(date instanceof Date))
			return this._progression.lastValue();

		return this._progression.valueAtDate(date);
	}

	/* ------------------------------------------------------------- *
	 * method: setProgression() sets the progression for this task
	 * ------------------------------------------------------------- */
	setProgression(progression, date)
	{
		this._progression.record(progression, date);

		this.refreshParent();
	}

	/* ------------------------------------------------------------- *
	 * method: getTags() returns the tags for this task
	 * ------------------------------------------------------------- */
	getTags()
	{
		return this._tags;
	}

	/* ------------------------------------------------------------- *
	 * method: addTag() add a tag to this task
	 * ------------------------------------------------------------- */
	addTag(caption)
	{
		var tag = Tag.getOrCreateTag(this._projectId, caption);

		if (tag !== null && (tag instanceof Tag))
		{
			var project = this.getProject();
			if (project !== null && project !== this)
			{
				project.addTag(caption);
			}

			var i = this._tags.indexOf(caption);
			if (i === -1)
			{
				this._tags.push(caption);
				tag.addToTask(this);
			}
		}

	}

	/* ------------------------------------------------------------- *
	 * method: removeTag() remove tag from this task
	 * ------------------------------------------------------------- */
	removeTag(caption)
	{
		var tagId = this._projectId + toSingleWord(caption);
		var tag = TAGS[tagId];

		if (tag !== null && (tag instanceof Tag))
		{
			var i = this._tags.indexOf(caption);
			if (i != -1)
			{
				this._tags.splice(i, 1);
			}
			tag.removeFromTask(this);
		}
	}

	/* ------------------------------------------------------------- *
	 * method: hasTag() returns true if such a tag is found
	 * ------------------------------------------------------------- */
	hasTag(tag)
	{
		if (tag instanceof Tag)
		{
			return this._tags.indexOf(tag.id()) !== -1;
		}
		else if (typeof(tag) === "string")
		{
			return this._tags.indexOf(this._projectId + toSingleWord(tag)) !== -1;
		}
		return false;
	}



	/* ------------------------------------------------------------- *
	 * method: getAuthor() returns the author for this task
	 * ------------------------------------------------------------- */
	getAuthor()
	{
		if (this._author !== null)
		{
			var result = USERS[this._author];
			if (result !== null && (result instanceof User))
			{
				return result;
			}
		}
		return null;
	}

	/* ------------------------------------------------------------- *
	 * method: setAuthor() sets the author for this task
	 * ------------------------------------------------------------- */
	setAuthor(author)
	{
		author.takeOwnership(this);
		this._author = author.id();
	}

	/* ------------------------------------------------------------- *
	 * method: getAssignee() returns the assignee for this task
	 * ------------------------------------------------------------- */
	getAssignee()
	{
		if (this._assignee !== null)
		{
			var result = USERS[this._assignee];
			if (result !== null && (result instanceof User))
			{
				return result;
			}
		}
		return null;
	}

	/* ------------------------------------------------------------- *
	 * method: setAssignee() sets the assignee for this task
	 * ------------------------------------------------------------- */
	setAssignee(user)
	{
		if (user === null)
		{
			if (this._assignee !== null)
			{
				var formerUser = this.getAssignee();
				this._assignee = null;
				if (formerUser !== null)
					formerUser.releaseTask(this);
			}
			this._assignee = null;
			this.addTag('no assignee');
		}
		else if (this._assignee != user.id())
		{
			this._assignee = user.id();
			user.takeTask(this);	
			this.removeTag('no assignee');
		}
		
	}

	/* ------------------------------------------------------------- *
	 * method: getParent() returns the parent task for this task
	 * ------------------------------------------------------------- */
	getParent()
	{
		return TASKS[this._parent];
	}

	/* ------------------------------------------------------------- *
	 * method: setParent() sets the parent task for this task
	 * ------------------------------------------------------------- */
	setParent(parent)
	{
		// TODO detect loop
		this._parent = parent.id();
	}

	/* ------------------------------------------------------------- *
	 * method: getSubtasks() returns the subtasks
	 * ------------------------------------------------------------- */
	getSubtasks()
	{
		return this._subTasks;
	}

	/* ------------------------------------------------------------- *
	 * method: addSubtask() adds the provided task as subtask
	 * ------------------------------------------------------------- */
	addSubtask(task)
	{
		var i = this._subTasks.indexOf(task.id());
		if (i === -1)
		{
			task.setParent(this);
			task._level = this.getLevel() + 1;
			this._subTasks.push(task.id());


			task._projectId = this._projectId;
			var project = task.getProject();

			if (project !== null)
			{
				var tags = task.getTags();
				for (var j = 0; j < tags.length; j++)
				{
					project.addTag(tags[j]);
				}
			}
		}

		this.removeTag('work package');

		task.refreshParent();
	}

	/* ------------------------------------------------------------- *
	 * method: removeSubtask() removes the provided task as subtask
	 * ------------------------------------------------------------- */
	removeSubtask(task)
	{
		var i = this._subTasks.indexOf(task.id());

		task._level--;

		if (i != -1)
		{
			this._subTasks[i].setParent(null);
			this._subTasks.splice(i, 1);
		}

		if (this._subTasks.length === 0)
			this.addTag('work package');

		this.refreshParent();
	}

	setDefaultBusinessHours()
	{
		delete this._bh;
		this._bh = {};
		for (var i = 1; i < 6; i++)
		{
			this._bh[i] = BusinessHours.getDefault();
		}
	}

}



/* ---------------------------------------------------------------- *
 * class Project
 *
 * summary: 
 * description: 
 *
 * ---------------------------------------------------------------- */

class Project extends Task
{
	/* ------------------------------------------------------------- *
	 * method: constructor
	 * ------------------------------------------------------------- */
	constructor(caption, description, author)
	{
		super(null, caption, description, author);

		this._teamMembers = {};
		PROJECTS[this.id()] = this.id();

		this.setDefaultBusinessHours();

		this.addTag('work package');
		this.addTag('no assignee');
		this.addTag('no estimate');
	}

	/* ------------------------------------------------------------- *
	 * method: getTeamMembers() returns the team members list
	 * ------------------------------------------------------------- */
	 getTeamMembers()
	 {
	 	return Object.keys(this._teamMembers);
	 }


	/* ------------------------------------------------------------- *
	 * method: addTeamMember() add the user with the provided id as team member
	 * ------------------------------------------------------------- */
	 addTeamMember(userId)
	 {
	 	this._teamMembers[userId] = userId;	
	 }

	 /* ------------------------------------------------------------- *
	 * method: removeTeamMember() removes the user with the provided id as team member
	 * ------------------------------------------------------------- */
	 removeTeamMember(userId)
	 {
	 	var user = USERS[userId];
	 	if (user !== null && (user instanceof User))
	 	{
	 		var tasks = user.getAssignedTasks();
	 		for (var i = 0; i < tasks.length; i++)
	 		{
	 			var task = TASKS[tasks[i]];
	 			if (task !== null && (task instanceof Task))
	 			{
	 				if (task.getProject() === this)
	 				{
	 					user.releaseTask(task);
	 				}
	 			}
	 		}

	 		delete this._teamMembers[userId];
	 	}
	 }
}