# 🔌 Fallbacks

What happens if a podlet server is down? Unresponsive? Responding too slowly? By default podium will simply render an empty string in its place. You might, however, want to have some measure of control over what gets shown. Enter fallbacks.

## How do fallbacks work?

On the first request to a podlet, podium will request the podlets manifest file inside of which it will discover the location of the podlets fallback route if one has been defined. It will then make a request to the fallback route and cache the response. Later, if the podlet server cannot be reached for any reason, podium will simply display the podlets cached fallback content instead.

## Defining a fallback route

asda
