
# HiAccordion

This is a simple nested-list component made in VanillaJs.

This project is jQuery Free!!! 🤟


## 👩🏽‍💻 Install and Configure

Import  `hiaccordion.css` and `hiaccordion.js` in your project.

## 🤹 How to use

You can create an instance using a `new` operator, like an example below:

	   var accordionOne = new HiAccordion({
	       elem: document.getElementsById('my-list-container')
	   });

#### Bind data and rendering component
Calling a bind method

    accordionOne.bind(data);

Or passing by options

    var accordionOne = new HiAccordion({
		elem: document.getElementsById('my-list-container'),
		data: yourData
	});

#### Options

	{
		elem: NodeDOM,
		data: object,
		errorCallback: function(),
		checkItemCallBack: function(),
		expandItemCallBack: function(),
		enableLocalStorage: bool,
	}


🔰 License
----
![Its Free](https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSLsKzPdVOwDVxikGynwZ522ALPrIa0FnUAA&usqp=CAU)


## 🧙🏻‍♂️ Contact Me

Rafael Boschini <rafaelboschini@gmail.com>
[My Linkedin](https://www.linkedin.com/in/rafael-boschini-5747311/) | [My Github](https://github.com/rafaelboschini)  | [My Stackoverflow Profile](https://pt.stackoverflow.com/users/34573/rboschini)
