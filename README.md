# BPjs-Web

BPjs-Web is a b-thread runner that allow inegration of b-threads in web pages using javascript.

The main function of the runner is run which described as follow (from the documentation):

     run (Generator)- Collect snapshot from the received b-threads, and get the new requested events.
                      If there were no 'request' events that aren't blocked, wait for the controller to receive an event.
                      When event e occur, the run generator will activate and will invoke the e unless it blocked.
                      In every iteration the b-threads that were activated by the generator invoke new b-threads, unless they                         dead.
 
      @param bThreads - List of generator functions.
In the 'Hanoi' example we use the BPjs-Web runner as controller, that collect events from the user and pass them to the runner for execution.

More information about BPjs can be found here- 

* https://github.com/bThink-BGU/BPjs
* https://bpjs.readthedocs.io/
