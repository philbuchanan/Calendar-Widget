function Calendar() {
	var _self = this;
	
	this.currentDate = new Date();
	this.viewingDate = new Date();
	this.viewingDate.setDate(1);
	
	this.daytimer = null;
	this.daytimerAction = function() {
		_self.updateCurrentDate();
	};
	this.resetDaytimer();
	
	this.updateTodayTitle();
	this.updateViewingMonth();
	this.addEvents();
}

// Update current day at midnight
Calendar.prototype.resetDaytimer = function() {
	var today = new Date(),
		tomorrow = new Date();
	
	if (this.daytimer) {
		clearTimeout(this.daytimer);
		this.daytimer = null;
	}
	
	tomorrow.setDate(today.getDate() + 1);
	tomorrow.setHours(0);
	tomorrow.setMinutes(0);
	tomorrow.setSeconds(1);
	
	this.daytimer = setTimeout(this.daytimerAction, tomorrow.getTime() - today.getTime());
};

Calendar.prototype.onShow = function() {
	this.updateCurrentDate();
};

Calendar.prototype.onHide = function() {
	if (this.daytimer) {
		clearTimeout(this.daytimer);
		this.daytimer = null;
	}
};

Calendar.prototype.Month = function(calendar) {
	this.domNode = document.createElement('div');
	this.domNode.id = 'month';
	
	(function(calendar) {
		var currentDate = calendar.currentDate,
			viewingDate = calendar.viewingDate,
			previousMonth = calendar.getRelativeMonth(viewingDate, -1),
			day = null,
			i = 1,
			prevCount = previousMonth.getDaysInMonth() - (viewingDate.getDay() - 1),
			currentCount = 1,
			nextCount = 1;
		
		for (i = 1; i <= 42; i += 1) {
			day = document.createElement('div');
			
			if (i <= viewingDate.getDay()) {
				day.className = 'previous-month';
				day.textContent = prevCount;
				prevCount += 1;
			}
			else if (i <= viewingDate.getDay() + viewingDate.getDaysInMonth()) {
				day.textContent = currentCount;
				if (viewingDate.getYear() === currentDate.getYear() &&
					viewingDate.getMonth() === currentDate.getMonth() &&
					currentDate.getDate() === currentCount) {
						day.id = 'current-day';
				}
				currentCount += 1;
			}
			else {
				day.textContent = nextCount;
				day.className = 'next-month';
				nextCount += 1;
			}
			
			this.domNode.appendChild(day);
		}
	}).call(this, calendar);
};

// Update date properties
Calendar.prototype.updateCurrentDate = function() {
	this.currentDate = new Date();
	
	this.updateTodayTitle();
	this.updateViewingMonth();
	
	this.resetDaytimer();
};

Calendar.prototype.updateViewingDate = function(request) {
	switch(request) {
		case 'next-month':
			this.viewingDate = this.getRelativeMonth(this.viewingDate, 1);
			break;
		case 'previous-month':
			this.viewingDate = this.getRelativeMonth(this.viewingDate, -1);
			break;
		default:
			this.viewingDate = new Date();
			this.viewingDate.setDate(1);
	}
};

// Update UI pieces
Calendar.prototype.updateTodayTitle = function() {
	var date = this.currentDate,
		title = date.getDayName() + ', ' + date.getMonthName() + ' ' + date.getDate();
	
	document.getElementById('today-title').textContent = title;
};

Calendar.prototype.updateViewingMonth = function() {
	var month = new this.Month(this),
		monthContainer = document.getElementById('month');
	
	monthContainer.parentNode.replaceChild(month.domNode, monthContainer);
	this.updateViewingMonthTitle();
};

Calendar.prototype.updateViewingMonthTitle = function() {
	var date = this.viewingDate,
		title = date.getFullYear() + '<span>/</span>' + date.getMonthName();
	
	document.getElementById('current-month-title').innerHTML = title;
};

// Get a new date
Calendar.prototype.getRelativeMonth = function(current, offset) {
	var date = new Date();
	
	date.setTime(current);
	date.setDate(1);
	date.setMonth(date.getMonth() + offset);
	
	return date;
};

// Events
Calendar.prototype.addEvents = function() {
	document.getElementById('buttons').addEventListener('click', this.buttonAction.bind(this), false);
	
	document.onkeydown = function() {
		var id;
		
		switch (window.event.keyCode) {
			case 37:
				id = 'previous-month';
				break;
			case 39:
				id = 'next-month';
				break;
		}
		
		if (id) {
			this.updateViewingDate(id);
			this.updateViewingMonth();
		}
	}.bind(this);
};

Calendar.prototype.buttonAction = function(event) {
	this.updateViewingDate(event.target.id);
	this.updateViewingMonth();
};

// Date object methods
if (Date.prototype.getDayName === undefined) {
	Date.prototype.getDayName = function() {
		var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
		return days[this.getDay()];
	};
}

if (Date.prototype.getMonthName === undefined) {
	Date.prototype.getMonthName = function() {
		var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
		return months[this.getMonth()];
	};
}

if (Date.prototype.getDaysInMonth === undefined) {
	Date.prototype.getDaysInMonth = function() {
		var date = new Date(this.getFullYear(), this.getMonth() + 1, 0);
		return date.getDate();
	};
}

// Start the calendar
var calendar = new Calendar();

if (widget) {
	widget.onshow = calendar.onShow.bind(calendar);
	widget.onhide = calendar.onHide.bind(calendar);
}