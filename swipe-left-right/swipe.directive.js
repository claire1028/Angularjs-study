angular.module('study', [])
.directive('swipeLeftRight', function () {
	return {
		restrict: 'EA',
		scope: {
			data: '=', 
			valueAttr: '@',
			labelAttr: '@',
			size: '=', //一页显示的条目数
			innerClass: '@' //特定的classname 防止和页面上其他的element class重复
		},
		template: `<div class="swipe-left {{innerClass}}">
						<div class="inner-wrapper" ng-repeat="gd in groupingData track by $index">
							<div class="col-8-24 text-center sub-content" ng-repeat="v in gd">
								<p class="value" ng-bind="v.{{valueAttr}}"></p>
								<p class="name" ng-bind="v.{{labelAttr}}"></p>
							</div>
						</div>
						<div class="dot" ng-if="data.length > size">
							<ul>
								<li ng-class="{active: $index === curPage }" ng-repeat="d in indicatorSize track by $index"></li>
							</ul>
						</div>
					</div>`,
		link(scope, element, attr) {
			scope.groupingData = [];
			if (scope.data.length <= scope.size) {
				scope.groupingData.push(scope.data);
				return;
			}

			element.addClass('swipe-container');
			scope.curPage = 0;
			let indicatorSize = Math.ceil(scope.data.length / scope.size);
			scope.indicatorSize = new Array(indicatorSize);
			for (let i = 0; i < indicatorSize; i++) {
				scope.groupingData[i] = scope.data.slice(i * scope.size, (i + 1) * scope.size);
			}

			let hasClassEditable = function() {
				return angular.element('.swipe-left').hasClass(scope.innerClass);
			};

			let startInitSwipe = function () {
				let ele = angular.element(`.swipe-left.${scope.innerClass}`);
				ele.css({width: indicatorSize * 100 + '%'});
				let perc = 100 / indicatorSize + '%';
				ele.find('.inner-wrapper').css({width: perc});
				ele.find('.dot').css({width: perc});

				let x, y, X, Y;
				ele.on('touchstart', function (event) {
					x = event.originalEvent.changedTouches[0].pageX;
					y = event.originalEvent.changedTouches[0].pageY;
				});
				ele.on('touchend', function (event) {
					X = event.originalEvent.changedTouches[0].pageX;
					Y = event.originalEvent.changedTouches[0].pageY;
					// 左右滑动
					if (Math.abs(X - x) - Math.abs(Y - y) > 0) {
						event.stopPropagation();
						if (X - x > 40) {   //右滑
							event.preventDefault();
							scope.$apply(function () {
								if (scope.curPage > 0) {
									scope.curPage -= 1;
									ele.find('.inner-wrapper').addClass('to-right');
									ele.find('.to-right').css({transform: `translateX(-${scope.curPage * 100}%)`});
								} else {
									return;
								}
							});
						}
						if (x - X > 40) {   //左滑
							event.preventDefault();
							scope.$apply(function () {
								if (scope.curPage < indicatorSize - 1) {
									scope.curPage += 1;
									ele.find('.inner-wrapper').addClass('to-left');
									ele.find('.to-left').css({transform: `translateX(-${scope.curPage * 100}%)`});
								} else {
									return;
								}
							});
						}
					}
				});
			};
			scope.$watch(hasClassEditable, function () {
				startInitSwipe();
			});
		}
	};
});