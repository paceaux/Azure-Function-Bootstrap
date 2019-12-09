const triggerQueueName = process.env.queueSettingTrigger;
const outputQueueName = process.env.queueSettingOut;

module.exports = {
	triggerQueue: triggerQueueName || '', // add default name for inbound queue
	outputQueue: outputQueueName // add efault name for outbound queue
};
