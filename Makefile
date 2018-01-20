contents-eater.zip:
	zip -r -FS contents-eater.zip src/* manifest.json LICENSE

clean:
	rm contents-eater.zip

